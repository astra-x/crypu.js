/*
 This file is part of crypu.js.

 crypu.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 crypu.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with crypu.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */

'use strict';

import { Logger } from '@ethersproject/logger';
import {
  Bytes,
  hexlify,
} from '@ethersproject/bytes';
import {
  Deferrable,
  defineReadOnly,
  resolveProperties,
  shallowCopy,
} from '@ethersproject/properties';
import { BigNumber } from '@ethersproject/bignumber';
import { randomBytes } from '@ethersproject/random';

import {
  BlockTag,
  Provider,
  TransactionRequest,
  TransactionResponse,
} from '@crypujs/abstract-provider';

const logger = new Logger('abstract-signer');

const allowedTransactionKeys: Array<string> = [
  'nonce',
  'gasPrice',
  'gasLimit',
  'blockLimit',
  'from',
  'to',
  'value',
  'data',
  'chainId',
  'groupId',
  'extraData',
];

// Sub-classes of Signer may optionally extend this interface to indicate
// they have a private key available synchronously
export interface ExternallyOwnedAccount {
  readonly address: string;
  readonly privateKey: string;
}

// Sub-Class Notes:
//  - A Signer MUST always make sure, that if present, the 'from' field
//    matches the Signer, before sending or signing a transaction
//  - A Signer SHOULD always wrap private information (such as a private
//    key or mnemonic) in a function, so that console.log does not leak
//    the data

export abstract class Signer {
  readonly provider?: Provider;

  ///////////////////
  // Sub-classes MUST implement these

  // Returns the checksum address
  abstract getAddress(): Promise<string>

  // Returns the signed prefixed-message. This MUST treat:
  // - Bytes as a binary message
  // - string as a UTF8-message
  // i.e. '0x1234' is a SIX (6) byte string, NOT 2 bytes of data
  abstract signMessage(message: Bytes | string): Promise<string>;

  // Signs a transaxction and returns the fully serialized, signed transaction.
  // The EXACT transaction MUST be signed, and NO additional properties to be added.
  // - This MAY throw if signing transactions is not supports, but if
  //   it does, sentTransaction MUST be overridden.
  abstract signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string>;

  // Returns a new instance of the Signer, connected to provider.
  // This MAY throw if changing providers is not supported.
  abstract connect(provider: Provider): Signer;

  readonly _isSigner: boolean;


  ///////////////////
  // Sub-classes MUST call super
  constructor() {
    logger.checkAbstract(new.target, Signer);
    defineReadOnly(this, '_isSigner', true);
  }


  ///////////////////
  // Sub-classes MAY override these

  async getTransactionCount(blockTag?: BlockTag): Promise<number> {
    this._checkProvider('getTransactionCount');
    return await this.provider.getTransactionCount(this.getAddress(), blockTag);
  }

  // Populates 'from' if unspecified, and calls with the transation
  async call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag): Promise<string> {
    this._checkProvider('call');
    const tx = await resolveProperties(this.checkTransaction(transaction));
    return await this.provider.call(tx, blockTag);
  }

  // Populates all fields in a transaction, signs it and sends it to the network
  async sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse> {
    this._checkProvider('sendTransaction');
    return this.populateTransaction(transaction).then(async (tx) => {
      const signedTx = await this.signTransaction(tx);
      return this.provider.sendTransaction(signedTx);
    });
  }

  async getChainId(): Promise<number> {
    this._checkProvider('getChainId');
    const network = await this.provider.getNetwork();
    return network.chainId;
  }

  async getGroupId(): Promise<number> {
    this._checkProvider('getGroupId');
    return this.provider.getGroupId();
  }

  async getBlockNumber(): Promise<number> {
    this._checkProvider('getBlockNumber');
    return this.provider.getBlockNumber();
  }

  async getGasPrice(): Promise<BigNumber> {
    this._checkProvider('getGasPrice');
    return this.provider.getGasPrice();
  }

  // Populates 'from' if unspecified, and estimates the gas for the transation
  async estimateGas(tx: Deferrable<TransactionRequest>): Promise<BigNumber> {
    this._checkProvider('estimateGas');
    return this.provider.estimateGas(tx);
  }

  async resolveName(name: string): Promise<string> {
    this._checkProvider('resolveName');
    return this.provider.resolveName(name);
  }

  // Checks a transaction does not contain invalid keys and if
  // no 'from' is provided, populates it.
  // - does NOT require a provider
  // - adds 'from' is not present
  // - returns a COPY (safe to mutate the result)
  // By default called from: (overriding these prevents it)
  //   - call
  //   - estimateGas
  //   - populateTransaction (and therefor sendTransaction)
  checkTransaction(transaction: Deferrable<TransactionRequest>): Deferrable<TransactionRequest> {
    for (const key in transaction) {
      if (allowedTransactionKeys.indexOf(key) === -1) {
        logger.throwArgumentError('invalid transaction key: ' + key, 'transaction', transaction);
      }
    }

    const tx = shallowCopy(transaction);

    if (tx.from == null) {
      tx.from = this.getAddress();
    } else {
      // Make sure any provided address matches this signer
      tx.from = Promise.all([
        Promise.resolve(tx.from),
        this.getAddress()
      ]).then((result) => {
        if (result[0] !== result[1]) {
          logger.throwArgumentError('from address mismatch', 'transaction', transaction);
        }
        return result[0];
      });
    }

    return tx;
  }

  // Populates ALL keys for a transaction and checks that 'from' matches
  // this Signer. Should be used by sendTransaction but NOT by signTransaction.
  // By default called from: (overriding these prevents it)
  //   - sendTransaction
  async populateTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionRequest> {

    const tx: Deferrable<TransactionRequest> = await resolveProperties(this.checkTransaction(transaction))

    if (tx.nonce == null) { tx.nonce = hexlify(randomBytes(16)); }
    if (tx.blockLimit == null) { tx.blockLimit = await this.getBlockNumber().then((blockNumber) => blockNumber + 100); }
    if (tx.to != null) { tx.to = Promise.resolve(tx.to).then((to) => this.resolveName(to)); }
    if (tx.chainId == null) { tx.chainId = this.getChainId(); }
    if (tx.groupId == null) { tx.groupId = this.getGroupId(); }

    if (tx.gasPrice == null) { tx.gasPrice = await this.getGasPrice(); }
    if (tx.gasLimit == null) { tx.gasLimit = await this.estimateGas(tx); }

    return await resolveProperties(tx);
  }

  ///////////////////
  // Sub-classes SHOULD leave these alone

  _checkProvider(operation?: string): void {
    if (!this.provider) {
      logger.throwError('missing provider', Logger.errors.UNSUPPORTED_OPERATION, {
        operation: (operation || '_checkProvider')
      });
    }
  }

  static isSigner(value: any): value is Signer {
    return !!(value && value._isSigner);
  }
}

export class VoidSigner extends Signer {
  readonly address: string;

  constructor(address: string, provider?: Provider) {
    logger.checkNew(new.target, VoidSigner);
    super();
    defineReadOnly(this, 'address', address);
    defineReadOnly(this, 'provider', provider || null);
  }

  getAddress(): Promise<string> {
    return Promise.resolve(this.address);
  }

  async _fail(message: string, operation: string): Promise<any> {
    await Promise.resolve();
    logger.throwError(message, Logger.errors.UNSUPPORTED_OPERATION, { operation: operation });
  }

  signMessage(_: Bytes | string): Promise<string> {
    return this._fail('VoidSigner cannot sign messages', 'signMessage');
  }

  signTransaction(_: Deferrable<TransactionRequest>): Promise<string> {
    return this._fail('VoidSigner cannot sign transactions', 'signTransaction');
  }

  connect(provider: Provider): VoidSigner {
    return new VoidSigner(this.address, provider);
  }
}

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
  BytesLike,
  SignatureLike,
  Signature,
  arrayify,
  concat,
  hexDataSlice,
  isBytesLike,
  isHexString,
  joinSignature,
} from '@ethersproject/bytes';
import { keccak256 } from '@ethersproject/keccak256';
import {
  defineReadOnly,
  resolveProperties,
} from '@ethersproject/properties';
import { randomBytes } from '@ethersproject/random';
import { getAddress } from '@ethersproject/address';
import { SigningKey } from '@ethersproject/signing-key';
import { hashMessage } from '@ethersproject/hash';
import { Wordlist } from '@ethersproject/wordlists';
import {
  HDNode,
  Mnemonic,
  defaultPath,
  entropyToMnemonic,
} from '@ethersproject/hdnode';
import {
  ProgressCallback,
  decryptJsonWallet,
  decryptJsonWalletSync,
  encryptKeystore,
} from '@ethersproject/json-wallets';

import {
  computeAddress,
  recoverAddress,
} from '@crypujs/transactions';
import {
  Provider,
  TransactionRequest,
} from '@crypujs/abstract-provider';
import {
  ExternallyOwnedAccount,
  Signer,
} from '@crypujs/abstract-signer';
import {
  SigningEscrow,
} from '@crypujs/signing-escrow';

const logger = new Logger('wallet');

function isAccount(value: any): value is ExternallyOwnedAccount {
  return (value != null && isHexString(value.privateKey, 32) && value.address != null);
}

function hasMnemonic(value: any): value is { mnemonic: Mnemonic } {
  const mnemonic = value.mnemonic;
  return (mnemonic && mnemonic.phrase);
}

export interface Signing {
  readonly curve: string;
  readonly privateKey: string;
  readonly publicKey: string;
};

export class Wallet extends Signer implements ExternallyOwnedAccount {

  readonly address: string;
  readonly provider: Provider;

  // Wrapping the _signingKey and _mnemonic in a getter function prevents
  // leaking the private key in console.log; still, be careful! :)
  readonly _signing: () => Signing;
  readonly _mnemonic: () => Mnemonic;

  constructor(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey | SigningEscrow, provider?: Provider) {
    logger.checkNew(new.target, Wallet);

    super();

    if (isBytesLike(privateKey)) {
      const signingKey = new SigningKey(privateKey);
      defineReadOnly(this, '_signing', () => signingKey);
    } else if (isAccount(privateKey)) {
      const signingKey = new SigningKey(privateKey.privateKey);
      defineReadOnly(this, '_signing', () => signingKey);

      if (computeAddress(this.publicKey) !== getAddress(privateKey.address)) {
        logger.throwArgumentError('privateKey/address mismatch', 'privateKey', '[REDACTED]');
      }
    } else if (SigningEscrow.isSigningEscrow(privateKey)) {
      defineReadOnly(this, '_signing', () => privateKey);
    } else if (SigningKey.isSigningKey(privateKey)) {
      if (privateKey.curve !== 'secp256k1') {
        logger.throwArgumentError('unsupported curve; must be secp256k1', 'privateKey', '[REDACTED]');
      }
      defineReadOnly(this, '_signing', () => privateKey);
    }
    defineReadOnly(
      this,
      'address',
      SigningEscrow.isSigningEscrow(this._signing())
        ? (<SigningEscrow>this._signing()).address
        : computeAddress(this.publicKey),
    );

    if (hasMnemonic(privateKey)) {
      const srcMnemonic = privateKey.mnemonic;
      defineReadOnly(this, '_mnemonic', () => (
        {
          phrase: srcMnemonic.phrase,
          path: srcMnemonic.path || defaultPath,
          locale: srcMnemonic.locale || 'en'
        }
      ));
      const mnemonic = this.mnemonic;
      const node = HDNode.fromMnemonic(mnemonic.phrase, null, mnemonic.locale).derivePath(mnemonic.path);
      if (computeAddress(node.privateKey) !== this.address) {
        logger.throwArgumentError('mnemonic/address mismatch', 'privateKey', '[REDACTED]');
      }
    } else {
      defineReadOnly(this, '_mnemonic', (): Mnemonic => null);
    }

    if (provider && !Provider.isProvider(provider)) {
      logger.throwArgumentError('invalid provider', 'provider', provider);
    }

    defineReadOnly(this, 'provider', provider || null);
  }

  get mnemonic(): Mnemonic { return this._mnemonic(); }
  get privateKey(): string { return this._signing().privateKey; }
  get publicKey(): string { return this._signing().publicKey; }

  async getAddress(): Promise<string> {
    return Promise.resolve(this.address);
  }

  async signDigest(digest: BytesLike): Promise<Signature> {
    if (SigningKey.isSigningKey(this._signing())) {
      return Promise.resolve((<SigningKey>this._signing()).signDigest(digest));
    } else {
      return (<SigningEscrow>this._signing()).signDigest(digest);
    }
  }

  connect(provider: Provider): Wallet {
    return new Wallet(this, provider);
  }

  async signTransaction(transaction: TransactionRequest): Promise<string> {
    return resolveProperties(transaction).then(async (tx) => {
      if (tx.from != null) {
        if (getAddress(tx.from) !== this.address) {
          throw new Error('transaction from address mismatch');
        }
        delete tx.from;
      }

      const signature = await this.signDigest(keccak256(this.provider.serializeTransaction(tx)));
      return this.provider.serializeTransaction(tx, signature);
    });
  }

  async signMessage(message: Bytes | string): Promise<string> {
    return Promise.resolve(joinSignature(await this.signDigest(hashMessage(message))));
  }

  async encrypt(password: Bytes | string, options?: any, progressCallback?: ProgressCallback): Promise<string> {
    if (typeof (options) === 'function' && !progressCallback) {
      progressCallback = options;
      options = {};
    }

    if (progressCallback && typeof (progressCallback) !== 'function') {
      throw new Error('invalid callback');
    }

    if (!options) { options = {}; }

    return encryptKeystore(this, password, options, progressCallback);
  }


  /**
   *  Static methods to create Wallet instances.
   */
  static createRandom(options?: any): Wallet {
    let entropy: Uint8Array = randomBytes(16);

    if (!options) { options = {}; }

    if (options.extraEntropy) {
      entropy = arrayify(hexDataSlice(keccak256(concat([entropy, options.extraEntropy])), 0, 16));
    }

    const mnemonic = entropyToMnemonic(entropy, options.locale);
    return Wallet.fromMnemonic(mnemonic, options.path, options.locale);
  }

  static async fromEncryptedJson(json: string, password: Bytes | string, progressCallback?: ProgressCallback): Promise<Wallet> {
    return decryptJsonWallet(json, password, progressCallback).then((account) => {
      return new Wallet(account);
    });
  }

  static fromEncryptedJsonSync(json: string, password: Bytes | string): Wallet {
    return new Wallet(decryptJsonWalletSync(json, password));
  }

  static fromMnemonic(mnemonic: string, path?: string, wordlist?: Wordlist): Wallet {
    if (!path) { path = defaultPath; }
    return new Wallet(HDNode.fromMnemonic(mnemonic, null, wordlist).derivePath(path));
  }
}

export function verifyMessage(message: Bytes | string, signature: SignatureLike): string {
  return recoverAddress(hashMessage(message), signature);
}

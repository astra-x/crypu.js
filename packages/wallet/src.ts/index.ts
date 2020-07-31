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

import { Logger } from '@ethersproject/logger';
import {
  Bytes,
  BytesLike,
  SignatureLike,
  arrayify,
  concat,
  hexDataSlice,
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
  UnsignedTransaction,
  computeAddress,
  recoverAddress,
  serialize,
} from '@crypujs/transactions';
import {
  Provider,
  TransactionRequest,
} from '@crypujs/abstract-provider';
import {
  ExternallyOwnedAccount,
  Signer,
} from '@crypujs/abstract-signer';

const logger = new Logger('wallet');

function isAccount(value: any): value is ExternallyOwnedAccount {
  return (value != null && isHexString(value.privateKey, 32) && value.address != null);
}

function hasMnemonic(value: any): value is { mnemonic: Mnemonic } {
  const mnemonic = value.mnemonic;
  return (mnemonic && mnemonic.phrase);
}

export class Wallet extends Signer implements ExternallyOwnedAccount {

  readonly address: string;
  readonly provider: Provider;

  // Wrapping the _signingKey and _mnemonic in a getter function prevents
  // leaking the private key in console.log; still, be careful! :)
  readonly _signingKey: () => SigningKey;
  readonly _mnemonic: () => Mnemonic;

  constructor(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey, provider?: Provider) {
    logger.checkNew(new.target, Wallet);

    super();

    if (isAccount(privateKey)) {
      const signingKey = new SigningKey(privateKey.privateKey);
      defineReadOnly(this, '_signingKey', () => signingKey);
      defineReadOnly(this, 'address', computeAddress(this.publicKey));

      if (this.address !== getAddress(privateKey.address)) {
        logger.throwArgumentError('privateKey/address mismatch', 'privateKey', '[REDACTED]');
      }

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


    } else {
      if (SigningKey.isSigningKey(privateKey)) {
        if (privateKey.curve !== 'secp256k1') {
          logger.throwArgumentError('unsupported curve; must be secp256k1', 'privateKey', '[REDACTED]');
        }
        defineReadOnly(this, '_signingKey', () => privateKey);
      } else {
        const signingKey = new SigningKey(privateKey);
        defineReadOnly(this, '_signingKey', () => signingKey);
      }
      defineReadOnly(this, '_mnemonic', (): Mnemonic => null);
      defineReadOnly(this, 'address', computeAddress(this.publicKey));
    }

    if (provider && !Provider.isProvider(provider)) {
      logger.throwArgumentError('invalid provider', 'provider', provider);
    }

    defineReadOnly(this, 'provider', provider || null);
  }

  get mnemonic(): Mnemonic { return this._mnemonic(); }
  get privateKey(): string { return this._signingKey().privateKey; }
  get publicKey(): string { return this._signingKey().publicKey; }

  async getAddress(): Promise<string> {
    return Promise.resolve(this.address);
  }

  connect(provider: Provider): Wallet {
    return new Wallet(this, provider);
  }

  async signTransaction(transaction: TransactionRequest): Promise<string> {
    return resolveProperties(transaction).then((tx) => {
      if (tx.from != null) {
        if (getAddress(tx.from) !== this.address) {
          throw new Error('transaction from address mismatch');
        }
        delete tx.from;
      }

      const signature = this._signingKey().signDigest(keccak256(serialize(<UnsignedTransaction>tx)));
      return serialize(<UnsignedTransaction>tx, signature);
    });
  }

  async signMessage(message: Bytes | string): Promise<string> {
    return Promise.resolve(joinSignature(this._signingKey().signDigest(hashMessage(message))));
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

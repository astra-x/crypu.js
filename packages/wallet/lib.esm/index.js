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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Logger } from '@ethersproject/logger';
import { arrayify, concat, hexDataSlice, isBytesLike, isHexString, joinSignature, } from '@ethersproject/bytes';
import { keccak256 } from '@ethersproject/keccak256';
import { defineReadOnly, resolveProperties, } from '@ethersproject/properties';
import { randomBytes } from '@ethersproject/random';
import { getAddress } from '@ethersproject/address';
import { SigningKey } from '@ethersproject/signing-key';
import { hashMessage } from '@ethersproject/hash';
import { HDNode, defaultPath, entropyToMnemonic, } from '@ethersproject/hdnode';
import { decryptJsonWallet, decryptJsonWalletSync, encryptKeystore, } from '@ethersproject/json-wallets';
import { computeAddress, recoverAddress, serialize, } from '@crypujs/transactions';
import { Provider, } from '@crypujs/abstract-provider';
import { Signer, } from '@crypujs/abstract-signer';
import { SigningEscrow, } from '@crypujs/signing-escrow';
const logger = new Logger('wallet');
function isAccount(value) {
    return (value != null && isHexString(value.privateKey, 32) && value.address != null);
}
function hasMnemonic(value) {
    const mnemonic = value.mnemonic;
    return (mnemonic && mnemonic.phrase);
}
;
export class Wallet extends Signer {
    constructor(privateKey, provider) {
        logger.checkNew(new.target, Wallet);
        super();
        if (isBytesLike(privateKey)) {
            const signingKey = new SigningKey(privateKey);
            defineReadOnly(this, '_signing', () => signingKey);
        }
        else if (isAccount(privateKey)) {
            const signingKey = new SigningKey(privateKey.privateKey);
            defineReadOnly(this, '_signing', () => signingKey);
            if (computeAddress(this.publicKey) !== getAddress(privateKey.address)) {
                logger.throwArgumentError('privateKey/address mismatch', 'privateKey', '[REDACTED]');
            }
        }
        else if (SigningEscrow.isSigningEscrow(privateKey)) {
            defineReadOnly(this, '_signing', () => privateKey);
        }
        else if (SigningKey.isSigningKey(privateKey)) {
            if (privateKey.curve !== 'secp256k1') {
                logger.throwArgumentError('unsupported curve; must be secp256k1', 'privateKey', '[REDACTED]');
            }
            defineReadOnly(this, '_signing', () => privateKey);
        }
        defineReadOnly(this, 'address', computeAddress(this.publicKey));
        if (hasMnemonic(privateKey)) {
            const srcMnemonic = privateKey.mnemonic;
            defineReadOnly(this, '_mnemonic', () => ({
                phrase: srcMnemonic.phrase,
                path: srcMnemonic.path || defaultPath,
                locale: srcMnemonic.locale || 'en'
            }));
            const mnemonic = this.mnemonic;
            const node = HDNode.fromMnemonic(mnemonic.phrase, null, mnemonic.locale).derivePath(mnemonic.path);
            if (computeAddress(node.privateKey) !== this.address) {
                logger.throwArgumentError('mnemonic/address mismatch', 'privateKey', '[REDACTED]');
            }
        }
        else {
            defineReadOnly(this, '_mnemonic', () => null);
        }
        if (provider && !Provider.isProvider(provider)) {
            logger.throwArgumentError('invalid provider', 'provider', provider);
        }
        defineReadOnly(this, 'provider', provider || null);
    }
    get mnemonic() { return this._mnemonic(); }
    get privateKey() { return this._signing().privateKey; }
    get publicKey() { return this._signing().publicKey; }
    getAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(this.address);
        });
    }
    signDigest(digest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (SigningKey.isSigningKey(this._signing())) {
                return Promise.resolve(this._signing().signDigest(digest));
            }
            else {
                return this._signing().signDigest(digest);
            }
        });
    }
    connect(provider) {
        return new Wallet(this, provider);
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return resolveProperties(transaction).then((tx) => __awaiter(this, void 0, void 0, function* () {
                if (tx.from != null) {
                    if (getAddress(tx.from) !== this.address) {
                        throw new Error('transaction from address mismatch');
                    }
                    delete tx.from;
                }
                const signature = yield this.signDigest(keccak256(serialize(tx)));
                return serialize(tx, signature);
            }));
        });
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(joinSignature(yield this.signDigest(hashMessage(message))));
        });
    }
    encrypt(password, options, progressCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (options) === 'function' && !progressCallback) {
                progressCallback = options;
                options = {};
            }
            if (progressCallback && typeof (progressCallback) !== 'function') {
                throw new Error('invalid callback');
            }
            if (!options) {
                options = {};
            }
            return encryptKeystore(this, password, options, progressCallback);
        });
    }
    /**
     *  Static methods to create Wallet instances.
     */
    static createRandom(options) {
        let entropy = randomBytes(16);
        if (!options) {
            options = {};
        }
        if (options.extraEntropy) {
            entropy = arrayify(hexDataSlice(keccak256(concat([entropy, options.extraEntropy])), 0, 16));
        }
        const mnemonic = entropyToMnemonic(entropy, options.locale);
        return Wallet.fromMnemonic(mnemonic, options.path, options.locale);
    }
    static fromEncryptedJson(json, password, progressCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            return decryptJsonWallet(json, password, progressCallback).then((account) => {
                return new Wallet(account);
            });
        });
    }
    static fromEncryptedJsonSync(json, password) {
        return new Wallet(decryptJsonWalletSync(json, password));
    }
    static fromMnemonic(mnemonic, path, wordlist) {
        if (!path) {
            path = defaultPath;
        }
        return new Wallet(HDNode.fromMnemonic(mnemonic, null, wordlist).derivePath(path));
    }
}
export function verifyMessage(message, signature) {
    return recoverAddress(hashMessage(message), signature);
}

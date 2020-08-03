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

Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMessage = exports.Wallet = void 0;
const logger_1 = require("@ethersproject/logger");
const bytes_1 = require("@ethersproject/bytes");
const keccak256_1 = require("@ethersproject/keccak256");
const properties_1 = require("@ethersproject/properties");
const random_1 = require("@ethersproject/random");
const address_1 = require("@ethersproject/address");
const signing_key_1 = require("@ethersproject/signing-key");
const hash_1 = require("@ethersproject/hash");
const hdnode_1 = require("@ethersproject/hdnode");
const json_wallets_1 = require("@ethersproject/json-wallets");
const transactions_1 = require("@crypujs/transactions");
const abstract_provider_1 = require("@crypujs/abstract-provider");
const abstract_signer_1 = require("@crypujs/abstract-signer");
const logger = new logger_1.Logger('wallet');
function isAccount(value) {
    return (value != null && bytes_1.isHexString(value.privateKey, 32) && value.address != null);
}
function hasMnemonic(value) {
    const mnemonic = value.mnemonic;
    return (mnemonic && mnemonic.phrase);
}
class Wallet extends abstract_signer_1.Signer {
    constructor(privateKey, provider) {
        logger.checkNew(new.target, Wallet);
        super();
        if (isAccount(privateKey)) {
            const signingKey = new signing_key_1.SigningKey(privateKey.privateKey);
            properties_1.defineReadOnly(this, '_signingKey', () => signingKey);
            properties_1.defineReadOnly(this, 'address', transactions_1.computeAddress(this.publicKey));
            if (this.address !== address_1.getAddress(privateKey.address)) {
                logger.throwArgumentError('privateKey/address mismatch', 'privateKey', '[REDACTED]');
            }
            if (hasMnemonic(privateKey)) {
                const srcMnemonic = privateKey.mnemonic;
                properties_1.defineReadOnly(this, '_mnemonic', () => ({
                    phrase: srcMnemonic.phrase,
                    path: srcMnemonic.path || hdnode_1.defaultPath,
                    locale: srcMnemonic.locale || 'en'
                }));
                const mnemonic = this.mnemonic;
                const node = hdnode_1.HDNode.fromMnemonic(mnemonic.phrase, null, mnemonic.locale).derivePath(mnemonic.path);
                if (transactions_1.computeAddress(node.privateKey) !== this.address) {
                    logger.throwArgumentError('mnemonic/address mismatch', 'privateKey', '[REDACTED]');
                }
            }
            else {
                properties_1.defineReadOnly(this, '_mnemonic', () => null);
            }
        }
        else {
            if (signing_key_1.SigningKey.isSigningKey(privateKey)) {
                if (privateKey.curve !== 'secp256k1') {
                    logger.throwArgumentError('unsupported curve; must be secp256k1', 'privateKey', '[REDACTED]');
                }
                properties_1.defineReadOnly(this, '_signingKey', () => privateKey);
            }
            else {
                const signingKey = new signing_key_1.SigningKey(privateKey);
                properties_1.defineReadOnly(this, '_signingKey', () => signingKey);
            }
            properties_1.defineReadOnly(this, '_mnemonic', () => null);
            properties_1.defineReadOnly(this, 'address', transactions_1.computeAddress(this.publicKey));
        }
        if (provider && !abstract_provider_1.Provider.isProvider(provider)) {
            logger.throwArgumentError('invalid provider', 'provider', provider);
        }
        properties_1.defineReadOnly(this, 'provider', provider || null);
    }
    get mnemonic() { return this._mnemonic(); }
    get privateKey() { return this._signingKey().privateKey; }
    get publicKey() { return this._signingKey().publicKey; }
    async getAddress() {
        return Promise.resolve(this.address);
    }
    connect(provider) {
        return new Wallet(this, provider);
    }
    async signTransaction(transaction) {
        return properties_1.resolveProperties(transaction).then((tx) => {
            if (tx.from != null) {
                if (address_1.getAddress(tx.from) !== this.address) {
                    throw new Error('transaction from address mismatch');
                }
                delete tx.from;
            }
            const signature = this._signingKey().signDigest(keccak256_1.keccak256(transactions_1.serialize(tx)));
            return transactions_1.serialize(tx, signature);
        });
    }
    async signMessage(message) {
        return Promise.resolve(bytes_1.joinSignature(this._signingKey().signDigest(hash_1.hashMessage(message))));
    }
    async encrypt(password, options, progressCallback) {
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
        return json_wallets_1.encryptKeystore(this, password, options, progressCallback);
    }
    /**
     *  Static methods to create Wallet instances.
     */
    static createRandom(options) {
        let entropy = random_1.randomBytes(16);
        if (!options) {
            options = {};
        }
        if (options.extraEntropy) {
            entropy = bytes_1.arrayify(bytes_1.hexDataSlice(keccak256_1.keccak256(bytes_1.concat([entropy, options.extraEntropy])), 0, 16));
        }
        const mnemonic = hdnode_1.entropyToMnemonic(entropy, options.locale);
        return Wallet.fromMnemonic(mnemonic, options.path, options.locale);
    }
    static async fromEncryptedJson(json, password, progressCallback) {
        return json_wallets_1.decryptJsonWallet(json, password, progressCallback).then((account) => {
            return new Wallet(account);
        });
    }
    static fromEncryptedJsonSync(json, password) {
        return new Wallet(json_wallets_1.decryptJsonWalletSync(json, password));
    }
    static fromMnemonic(mnemonic, path, wordlist) {
        if (!path) {
            path = hdnode_1.defaultPath;
        }
        return new Wallet(hdnode_1.HDNode.fromMnemonic(mnemonic, null, wordlist).derivePath(path));
    }
}
exports.Wallet = Wallet;
function verifyMessage(message, signature) {
    return transactions_1.recoverAddress(hash_1.hashMessage(message), signature);
}
exports.verifyMessage = verifyMessage;

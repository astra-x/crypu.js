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
exports.VoidSigner = exports.Signer = void 0;
const logger_1 = require("@ethersproject/logger");
const bytes_1 = require("@ethersproject/bytes");
const properties_1 = require("@ethersproject/properties");
const random_1 = require("@ethersproject/random");
const logger = new logger_1.Logger('abstract-signer');
const allowedTransactionKeys = [
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
// Sub-Class Notes:
//  - A Signer MUST always make sure, that if present, the 'from' field
//    matches the Signer, before sending or signing a transaction
//  - A Signer SHOULD always wrap private information (such as a private
//    key or mnemonic) in a function, so that console.log does not leak
//    the data
class Signer {
    ///////////////////
    // Sub-classes MUST call super
    constructor() {
        logger.checkAbstract(new.target, Signer);
        properties_1.defineReadOnly(this, '_isSigner', true);
    }
    ///////////////////
    // Sub-classes MAY override these
    async getTransactionCount(blockTag) {
        this._checkProvider('getTransactionCount');
        return await this.provider.getTransactionCount(this.getAddress(), blockTag);
    }
    // Populates 'from' if unspecified, and calls with the transation
    async call(transaction, blockTag) {
        this._checkProvider('call');
        const tx = await properties_1.resolveProperties(this.checkTransaction(transaction));
        return await this.provider.call(tx, blockTag);
    }
    // Populates all fields in a transaction, signs it and sends it to the network
    async sendTransaction(transaction) {
        this._checkProvider('sendTransaction');
        return this.populateTransaction(transaction).then(async (tx) => {
            const signedTx = await this.signTransaction(tx);
            return this.provider.sendTransaction(signedTx);
        });
    }
    async getChainId() {
        this._checkProvider('getChainId');
        const network = await this.provider.getNetwork();
        return network.chainId;
    }
    async getGroupId() {
        this._checkProvider('getGroupId');
        return this.provider.getGroupId();
    }
    async getBlockNumber() {
        this._checkProvider('getBlockNumber');
        return this.provider.getBlockNumber();
    }
    async getGasPrice() {
        this._checkProvider('getGasPrice');
        return this.provider.getGasPrice();
    }
    // Populates 'from' if unspecified, and estimates the gas for the transation
    async estimateGas(_) {
        this._checkProvider('estimateGas');
        return this.provider.estimateGas();
    }
    async resolveName(name) {
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
    checkTransaction(transaction) {
        for (const key in transaction) {
            if (allowedTransactionKeys.indexOf(key) === -1) {
                logger.throwArgumentError('invalid transaction key: ' + key, 'transaction', transaction);
            }
        }
        const tx = properties_1.shallowCopy(transaction);
        if (tx.from == null) {
            tx.from = this.getAddress();
        }
        else {
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
    async populateTransaction(transaction) {
        const tx = await properties_1.resolveProperties(this.checkTransaction(transaction));
        if (tx.nonce == null) {
            tx.nonce = bytes_1.hexlify(random_1.randomBytes(16));
        }
        if (tx.blockLimit == null) {
            tx.blockLimit = this.getBlockNumber().then((blockNumber) => blockNumber + 100);
        }
        if (tx.to != null) {
            tx.to = Promise.resolve(tx.to).then((to) => this.resolveName(to));
        }
        if (tx.chainId == null) {
            tx.chainId = this.getChainId();
        }
        if (tx.groupId == null) {
            tx.groupId = this.getGroupId();
        }
        if (tx.gasPrice == null) {
            tx.gasPrice = this.getGasPrice();
        }
        if (tx.gasLimit == null) {
            tx.gasLimit = this.estimateGas(tx);
        }
        return await properties_1.resolveProperties(tx);
    }
    ///////////////////
    // Sub-classes SHOULD leave these alone
    _checkProvider(operation) {
        if (!this.provider) {
            logger.throwError('missing provider', logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                operation: (operation || '_checkProvider')
            });
        }
    }
    static isSigner(value) {
        return !!(value && value._isSigner);
    }
}
exports.Signer = Signer;
class VoidSigner extends Signer {
    constructor(address, provider) {
        logger.checkNew(new.target, VoidSigner);
        super();
        properties_1.defineReadOnly(this, 'address', address);
        properties_1.defineReadOnly(this, 'provider', provider || null);
    }
    getAddress() {
        return Promise.resolve(this.address);
    }
    async _fail(message, operation) {
        await Promise.resolve();
        logger.throwError(message, logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: operation });
    }
    signMessage(_) {
        return this._fail('VoidSigner cannot sign messages', 'signMessage');
    }
    signTransaction(_) {
        return this._fail('VoidSigner cannot sign transactions', 'signTransaction');
    }
    connect(provider) {
        return new VoidSigner(this.address, provider);
    }
}
exports.VoidSigner = VoidSigner;

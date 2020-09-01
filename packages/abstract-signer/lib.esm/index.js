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
import { defineReadOnly, resolveProperties, shallowCopy, } from '@ethersproject/properties';
const logger = new Logger('abstract-signer');
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
export class Signer {
    ///////////////////
    // Sub-classes MUST call super
    constructor() {
        logger.checkAbstract(new.target, Signer);
        defineReadOnly(this, '_isSigner', true);
    }
    ///////////////////
    // Sub-classes MAY override these
    getTransactionCount(blockTag) {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkProvider('getTransactionCount');
            return yield this.provider.getTransactionCount(this.getAddress(), blockTag);
        });
    }
    // Populates 'from' if unspecified, and calls with the transation
    call(transaction, blockTag) {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkProvider('call');
            const tx = yield resolveProperties(this.checkTransaction(transaction));
            return yield this.provider.call(tx, blockTag);
        });
    }
    // Populates all fields in a transaction, signs it and sends it to the network
    sendTransaction(transaction, hook) {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkProvider('sendTransaction');
            return this.provider.populateTransaction(this.checkTransaction(transaction)).then((tx) => __awaiter(this, void 0, void 0, function* () {
                const signedTx = yield this.signTransaction(tx);
                return this.provider.sendTransaction(signedTx, hook);
            }));
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkProvider('getChainId');
            return this.provider.getChainId();
        });
    }
    getGroupId() {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkProvider('getGroupId');
            return this.provider.getGroupId();
        });
    }
    getBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkProvider('getBlockNumber');
            return this.provider.getBlockNumber();
        });
    }
    getGasPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkProvider('getGasPrice');
            return this.provider.getGasPrice();
        });
    }
    // Populates 'from' if unspecified, and estimates the gas for the transation
    estimateGas(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkProvider('estimateGas');
            return this.provider.estimateGas(tx);
        });
    }
    resolveName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this._checkProvider('resolveName');
            return this.provider.resolveName(name);
        });
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
        const tx = shallowCopy(transaction);
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
    ///////////////////
    // Sub-classes SHOULD leave these alone
    _checkProvider(operation) {
        if (!this.provider) {
            logger.throwError('missing provider', Logger.errors.UNSUPPORTED_OPERATION, {
                operation: (operation || '_checkProvider')
            });
        }
    }
    static isSigner(value) {
        return !!(value && value._isSigner);
    }
}
export class VoidSigner extends Signer {
    constructor(address, provider) {
        logger.checkNew(new.target, VoidSigner);
        super();
        defineReadOnly(this, 'address', address);
        defineReadOnly(this, 'provider', provider || null);
    }
    getAddress() {
        return Promise.resolve(this.address);
    }
    _fail(message, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.resolve();
            logger.throwError(message, Logger.errors.UNSUPPORTED_OPERATION, { operation: operation });
        });
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

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
import { isHexString, } from '@ethersproject/bytes';
import { Description, defineReadOnly, } from '@ethersproject/properties';
const logger = new Logger('abstract-provider');
;
;
//export type CallTransactionable = {
//    call(transaction: TransactionRequest): Promise<TransactionResponse>;
//};
export class ForkEvent extends Description {
    static isForkEvent(value) {
        return !!(value && value._isForkEvent);
    }
}
export class BlockForkEvent extends ForkEvent {
    constructor(blockHash, expiry) {
        if (!isHexString(blockHash, 32)) {
            logger.throwArgumentError('invalid blockHash', 'blockHash', blockHash);
        }
        super({
            _isForkEvent: true,
            _isBlockForkEvent: true,
            expiry: (expiry || 0),
            blockHash: blockHash
        });
    }
}
export class TransactionForkEvent extends ForkEvent {
    constructor(hash, expiry) {
        if (!isHexString(hash, 32)) {
            logger.throwArgumentError('invalid transaction hash', 'hash', hash);
        }
        super({
            _isForkEvent: true,
            _isTransactionForkEvent: true,
            expiry: (expiry || 0),
            hash: hash
        });
    }
}
export class TransactionOrderForkEvent extends ForkEvent {
    constructor(beforeHash, afterHash, expiry) {
        if (!isHexString(beforeHash, 32)) {
            logger.throwArgumentError('invalid transaction hash', 'beforeHash', beforeHash);
        }
        if (!isHexString(afterHash, 32)) {
            logger.throwArgumentError('invalid transaction hash', 'afterHash', afterHash);
        }
        super({
            _isForkEvent: true,
            _isTransactionOrderForkEvent: true,
            expiry: (expiry || 0),
            beforeHash: beforeHash,
            afterHash: afterHash
        });
    }
}
///////////////////////////////
// Exported Abstracts
export class Provider {
    constructor() {
        logger.checkAbstract(new.target, Provider);
        defineReadOnly(this, '_isProvider', true);
    }
    // Alias for 'on'
    addListener(eventName, listener) {
        return this.on(eventName, listener);
    }
    // Alias for 'off'
    removeListener(eventName, listener) {
        return this.off(eventName, listener);
    }
    static isProvider(value) {
        return !!(value && value._isProvider);
    }
}

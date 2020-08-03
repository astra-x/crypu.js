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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = exports.TransactionOrderForkEvent = exports.TransactionForkEvent = exports.BlockForkEvent = exports.ForkEvent = void 0;
var logger_1 = require("@ethersproject/logger");
var bytes_1 = require("@ethersproject/bytes");
var properties_1 = require("@ethersproject/properties");
var logger = new logger_1.Logger('abstract-provider');
;
;
//export type CallTransactionable = {
//    call(transaction: TransactionRequest): Promise<TransactionResponse>;
//};
var ForkEvent = /** @class */ (function (_super) {
    __extends(ForkEvent, _super);
    function ForkEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForkEvent.isForkEvent = function (value) {
        return !!(value && value._isForkEvent);
    };
    return ForkEvent;
}(properties_1.Description));
exports.ForkEvent = ForkEvent;
var BlockForkEvent = /** @class */ (function (_super) {
    __extends(BlockForkEvent, _super);
    function BlockForkEvent(blockHash, expiry) {
        var _this = this;
        if (!bytes_1.isHexString(blockHash, 32)) {
            logger.throwArgumentError('invalid blockHash', 'blockHash', blockHash);
        }
        _this = _super.call(this, {
            _isForkEvent: true,
            _isBlockForkEvent: true,
            expiry: (expiry || 0),
            blockHash: blockHash
        }) || this;
        return _this;
    }
    return BlockForkEvent;
}(ForkEvent));
exports.BlockForkEvent = BlockForkEvent;
var TransactionForkEvent = /** @class */ (function (_super) {
    __extends(TransactionForkEvent, _super);
    function TransactionForkEvent(hash, expiry) {
        var _this = this;
        if (!bytes_1.isHexString(hash, 32)) {
            logger.throwArgumentError('invalid transaction hash', 'hash', hash);
        }
        _this = _super.call(this, {
            _isForkEvent: true,
            _isTransactionForkEvent: true,
            expiry: (expiry || 0),
            hash: hash
        }) || this;
        return _this;
    }
    return TransactionForkEvent;
}(ForkEvent));
exports.TransactionForkEvent = TransactionForkEvent;
var TransactionOrderForkEvent = /** @class */ (function (_super) {
    __extends(TransactionOrderForkEvent, _super);
    function TransactionOrderForkEvent(beforeHash, afterHash, expiry) {
        var _this = this;
        if (!bytes_1.isHexString(beforeHash, 32)) {
            logger.throwArgumentError('invalid transaction hash', 'beforeHash', beforeHash);
        }
        if (!bytes_1.isHexString(afterHash, 32)) {
            logger.throwArgumentError('invalid transaction hash', 'afterHash', afterHash);
        }
        _this = _super.call(this, {
            _isForkEvent: true,
            _isTransactionOrderForkEvent: true,
            expiry: (expiry || 0),
            beforeHash: beforeHash,
            afterHash: afterHash
        }) || this;
        return _this;
    }
    return TransactionOrderForkEvent;
}(ForkEvent));
exports.TransactionOrderForkEvent = TransactionOrderForkEvent;
///////////////////////////////
// Exported Abstracts
var Provider = /** @class */ (function () {
    function Provider() {
        var _newTarget = this.constructor;
        logger.checkAbstract(_newTarget, Provider);
        properties_1.defineReadOnly(this, '_isProvider', true);
    }
    // Alias for 'on'
    Provider.prototype.addListener = function (eventName, listener) {
        return this.on(eventName, listener);
    };
    // Alias for 'off'
    Provider.prototype.removeListener = function (eventName, listener) {
        return this.off(eventName, listener);
    };
    Provider.isProvider = function (value) {
        return !!(value && value._isProvider);
    };
    return Provider;
}());
exports.Provider = Provider;

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
 * @file formatter.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formatter = void 0;
var logger_1 = require("@ethersproject/logger");
var bytes_1 = require("@ethersproject/bytes");
var properties_1 = require("@ethersproject/properties");
var bignumber_1 = require("@ethersproject/bignumber");
var constants_1 = require("@ethersproject/constants");
var address_1 = require("@ethersproject/address");
var transactions_1 = require("@crypujs/transactions");
var logger = new logger_1.Logger('providers');
var Formatter = /** @class */ (function () {
    function Formatter() {
        var _newTarget = this.constructor;
        logger.checkNew(_newTarget, Formatter);
        properties_1.defineReadOnly(this, 'formats', this.getDefaultFormats());
    }
    Formatter.prototype.getDefaultFormats = function () {
        var _this = this;
        var address = this.address.bind(this);
        var bigNumber = this.bigNumber.bind(this);
        var blockTag = this.blockTag.bind(this);
        var data = this.data.bind(this);
        var hash = this.hash.bind(this);
        var hex = this.hex.bind(this);
        var number = this.number.bind(this);
        var strictData = function (v) { return _this.data(v, true); };
        var formats = {};
        formats.transaction = {
            hash: hash,
            blockHash: Formatter.allowNull(hash, null),
            blockNumber: Formatter.allowNull(number, null),
            transactionIndex: Formatter.allowNull(number, null),
            confirmations: Formatter.allowNull(number, null),
            from: address,
            gasPrice: bigNumber,
            gasLimit: bigNumber,
            to: Formatter.allowNull(address, null),
            value: bigNumber,
            nonce: bigNumber,
            data: data,
            r: Formatter.allowNull(this.uint256),
            s: Formatter.allowNull(this.uint256),
            v: Formatter.allowNull(number),
            creates: Formatter.allowNull(address, null),
            raw: Formatter.allowNull(data),
        };
        formats.transactionRequest = {
            from: Formatter.allowNull(address),
            nonce: Formatter.allowNull(bigNumber),
            gasLimit: Formatter.allowNull(bigNumber),
            gasPrice: Formatter.allowNull(bigNumber),
            to: Formatter.allowNull(address),
            value: Formatter.allowNull(bigNumber),
            data: Formatter.allowNull(strictData),
        };
        formats.receiptLog = {
            address: address,
            data: data,
            topics: Formatter.arrayOf(hash),
            blockHash: Formatter.allowNull(hash),
            blockNumber: Formatter.allowNull(number),
            transactionHash: Formatter.allowNull(hash),
            transactionIndex: Formatter.allowNull(number),
            logIndex: Formatter.allowNull(number),
        };
        formats.receipt = {
            to: Formatter.allowNull(this.address, null),
            from: Formatter.allowNull(this.address, null),
            contractAddress: Formatter.allowNull(address, null),
            gasUsed: bigNumber,
            blockHash: hash,
            blockNumber: number,
            transactionHash: hash,
            transactionIndex: number,
            root: Formatter.allowNull(hash),
            logs: Formatter.arrayOf(this.receiptLog.bind(this)),
            logsBloom: Formatter.allowNull(data, null),
            status: Formatter.allowNull(number),
            input: Formatter.allowNull(data),
            output: Formatter.allowNull(data),
            cumulativeGasUsed: Formatter.allowNull(bigNumber),
            confirmations: Formatter.allowNull(number, null),
        };
        formats.block = {
            timestamp: number,
            nonce: Formatter.allowNull(hex),
            difficulty: this.difficulty.bind(this),
            extraData: this.extraData.bind(this),
            gasLimit: bigNumber,
            gasUsed: bigNumber,
            hash: hash,
            parentHash: hash,
            number: number,
            sealer: hex,
            sealerList: Formatter.arrayOf(hex),
            transactions: Formatter.arrayOf(hash),
            stateRoot: hash,
            transactionsRoot: hash,
            receiptsRoot: hash,
        };
        formats.blockWithTransactions = properties_1.shallowCopy(formats.block);
        formats.blockWithTransactions.transactions = Formatter.allowNull(Formatter.arrayOf(this.transactionResponse.bind(this)));
        formats.filter = {
            fromBlock: Formatter.allowNull(blockTag, undefined),
            toBlock: Formatter.allowNull(blockTag, undefined),
            blockHash: Formatter.allowNull(hash, undefined),
            address: Formatter.allowNull(address, undefined),
            topics: Formatter.allowNull(this.topics.bind(this), undefined),
        };
        formats.filterLog = {
            blockNumber: Formatter.allowNull(number),
            blockHash: Formatter.allowNull(hash),
            transactionIndex: number,
            removed: Formatter.allowNull(this.boolean.bind(this)),
            address: address,
            data: Formatter.allowFalsish(data, '0x'),
            topics: Formatter.arrayOf(hash),
            transactionHash: hash,
            logIndex: number,
        };
        return formats;
    };
    // Requires a BigNumberish that is within the IEEE754 safe integer range; returns a number
    // Strict! Used on input.
    Formatter.prototype.number = function (number) {
        return bignumber_1.BigNumber.from(number).toNumber();
    };
    // Strict! Used on input.
    Formatter.prototype.bigNumber = function (value) {
        return bignumber_1.BigNumber.from(value);
    };
    // Requires a boolean, 'true' or  'false'; returns a boolean
    Formatter.prototype.boolean = function (value) {
        if (typeof (value) === 'boolean') {
            return value;
        }
        if (typeof (value) === 'string') {
            value = value.toLowerCase();
            if (value === 'true') {
                return true;
            }
            if (value === 'false') {
                return false;
            }
        }
        throw new Error('invalid boolean - ' + value);
    };
    Formatter.prototype.hex = function (value, strict) {
        if (typeof (value) === 'string') {
            if (!strict && value.substring(0, 2) !== '0x') {
                value = '0x' + value;
            }
            if (bytes_1.isHexString(value)) {
                return value.toLowerCase();
            }
        }
        return logger.throwArgumentError('invalid hex', 'value', value);
    };
    Formatter.prototype.data = function (value, strict) {
        var result = this.hex(value, strict);
        if ((result.length % 2) !== 0) {
            throw new Error('invalid data; odd-length - ' + value);
        }
        return result;
    };
    // Requires an address
    // Strict! Used on input.
    Formatter.prototype.address = function (value) {
        return address_1.getAddress(value);
    };
    Formatter.prototype.callAddress = function (value) {
        if (!bytes_1.isHexString(value, 32)) {
            return constants_1.AddressZero;
        }
        return address_1.getAddress(bytes_1.hexDataSlice(value, 12));
    };
    Formatter.prototype.contractAddress = function (value) {
        return address_1.getContractAddress(value);
    };
    // Strict! Used on input.
    Formatter.prototype.blockTag = function (blockTag) {
        if (blockTag == null) {
            return 'latest';
        }
        if (blockTag === 'earliest') {
            return '0x0';
        }
        if (blockTag === 'latest' || blockTag === 'pending') {
            return blockTag;
        }
        if (typeof (blockTag) === 'number' || bytes_1.isHexString(blockTag)) {
            return bytes_1.hexValue(blockTag);
        }
        throw new Error('invalid blockTag');
    };
    // Requires a hash, optionally requires 0x prefix; returns prefixed lowercase hash.
    Formatter.prototype.hash = function (value, strict) {
        var result = this.hex(value, strict);
        if (bytes_1.hexDataLength(result) !== 32) {
            return logger.throwArgumentError('invalid hash', 'value', value);
        }
        return result;
    };
    Formatter.prototype.difficulty = function (value) {
        if (value == null) {
            return undefined;
        }
        var v = bignumber_1.BigNumber.from(value);
        try {
            return v.toNumber();
        }
        catch (error) { }
        return undefined;
    };
    Formatter.prototype.extraData = function (value) {
        if (value == null) {
            return null;
        }
        if (typeof value === 'string') {
            return this.hex(value, true);
        }
        return Formatter.arrayOf(this.hex.bind(this))(value);
    };
    Formatter.prototype.uint256 = function (value) {
        if (!bytes_1.isHexString(value)) {
            throw new Error('invalid uint256');
        }
        return bytes_1.hexZeroPad(value, 32);
    };
    Formatter.prototype._block = function (value, format) {
        if (value.miner != null && value.sealer == null) {
            value.sealer = value.miner;
            value.sealerList = [];
        }
        return Formatter.check(format, value);
    };
    Formatter.prototype.block = function (value) {
        return this._block(value, this.formats.block);
    };
    Formatter.prototype.blockWithTransactions = function (value) {
        return this._block(value, this.formats.blockWithTransactions);
    };
    // Strict! Used on input.
    Formatter.prototype.transactionRequest = function (value) {
        return Formatter.check(this.formats.transactionRequest, value);
    };
    Formatter.prototype.transactionResponse = function (transaction) {
        // Rename gas to gasLimit
        if (transaction.gas != null && transaction.gasLimit == null) {
            transaction.gasLimit = transaction.gas;
        }
        // Some clients (TestRPC) do strange things like return 0x0 for the
        // 0 address; correct this to be a real address
        if (transaction.to && bignumber_1.BigNumber.from(transaction.to).isZero()) {
            transaction.to = '0x0000000000000000000000000000000000000000';
        }
        // Rename input to data
        if (transaction.input != null && transaction.data == null) {
            transaction.data = transaction.input;
        }
        // If to and creates are empty, populate the creates from the transaction
        if (transaction.to == null && transaction.creates == null) {
            transaction.creates = this.contractAddress(transaction);
        }
        // @TODO: use transaction.serialize? Have to add support for including v, r, and s...
        /*
        if (!transaction.raw) {
    
             // Very loose providers (e.g. TestRPC) do not provide a signature or raw
             if (transaction.v && transaction.r && transaction.s) {
                 let raw = [
                     stripZeros(hexlify(transaction.nonce)),
                     stripZeros(hexlify(transaction.gasPrice)),
                     stripZeros(hexlify(transaction.gasLimit)),
                     (transaction.to || '0x'),
                     stripZeros(hexlify(transaction.value || '0x')),
                     hexlify(transaction.data || '0x'),
                     stripZeros(hexlify(transaction.v || '0x')),
                     stripZeros(hexlify(transaction.r)),
                     stripZeros(hexlify(transaction.s)),
                 ];
    
                 transaction.raw = rlpEncode(raw);
             }
         }
         */
        var result = Formatter.check(this.formats.transaction, transaction);
        if (transaction.chainId != null) {
            var chainId = transaction.chainId;
            if (bytes_1.isHexString(chainId)) {
                chainId = bignumber_1.BigNumber.from(chainId).toNumber();
            }
            result.chainId = chainId;
        }
        else {
            var chainId = transaction.networkId;
            // geth-etc returns chainId
            if (chainId == null && result.v == null) {
                chainId = transaction.chainId;
            }
            if (bytes_1.isHexString(chainId)) {
                chainId = bignumber_1.BigNumber.from(chainId).toNumber();
            }
            if (typeof (chainId) !== 'number' && result.v != null) {
                chainId = (result.v - 35) / 2;
                if (chainId < 0) {
                    chainId = 0;
                }
                chainId = parseInt(chainId);
            }
            if (typeof (chainId) !== 'number') {
                chainId = 0;
            }
            result.chainId = chainId;
        }
        // 0x0000... should actually be null
        if (result.blockHash && result.blockHash.replace(/0/g, '') === 'x') {
            result.blockHash = null;
        }
        return result;
    };
    Formatter.prototype.transaction = function (value) {
        return transactions_1.parse(value);
    };
    Formatter.prototype.receiptLog = function (value) {
        return Formatter.check(this.formats.receiptLog, value);
    };
    Formatter.prototype.receipt = function (value) {
        return Formatter.check(this.formats.receipt, value);
    };
    Formatter.prototype.topics = function (value) {
        var _this = this;
        if (Array.isArray(value)) {
            return value.map(function (v) { return _this.topics(v); });
        }
        else if (value != null) {
            return this.hash(value, true);
        }
        return null;
    };
    Formatter.prototype.filter = function (value) {
        return Formatter.check(this.formats.filter, value);
    };
    Formatter.prototype.filterLog = function (value) {
        return Formatter.check(this.formats.filterLog, value);
    };
    Formatter.check = function (format, object) {
        var result = {};
        for (var key in format) {
            try {
                var value = format[key](object[key]);
                if (value !== undefined) {
                    result[key] = value;
                }
            }
            catch (error) {
                error.checkKey = key;
                error.checkValue = object[key];
                throw error;
            }
        }
        return result;
    };
    // if value is null-ish, nullValue is returned
    Formatter.allowNull = function (format, nullValue) {
        return (function (value) {
            if (value == null) {
                return nullValue;
            }
            return format(value);
        });
    };
    // If value is false-ish, replaceValue is returned
    Formatter.allowFalsish = function (format, replaceValue) {
        return (function (value) {
            if (!value) {
                return replaceValue;
            }
            return format(value);
        });
    };
    // Requires an Array satisfying check
    Formatter.arrayOf = function (format) {
        return (function (array) {
            if (!Array.isArray(array)) {
                throw new Error('not an array');
            }
            var result = [];
            array.forEach(function (value) {
                result.push(format(value));
            });
            return result;
        });
    };
    return Formatter;
}());
exports.Formatter = Formatter;

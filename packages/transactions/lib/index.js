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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.serialize = exports.recoverAddress = exports.computeAddress = void 0;
var logger_1 = require("@ethersproject/logger");
var bytes_1 = require("@ethersproject/bytes");
var keccak256_1 = require("@ethersproject/keccak256");
var properties_1 = require("@ethersproject/properties");
var bignumber_1 = require("@ethersproject/bignumber");
var constants_1 = require("@ethersproject/constants");
var RLP = __importStar(require("@ethersproject/rlp"));
var address_1 = require("@ethersproject/address");
var signing_key_1 = require("@ethersproject/signing-key");
///////////////////////////////
var logger = new logger_1.Logger('transactions');
var transactionFields = [
    { name: 'nonce', maxLength: 16, numeric: true },
    { name: 'gasPrice', maxLength: 32, numeric: true },
    { name: 'gasLimit', maxLength: 32, numeric: true },
    { name: 'blockLimit', maxLength: 32, numeric: true },
    { name: 'to', length: 20 },
    { name: 'value', maxLength: 32, numeric: true },
    { name: 'data' },
    { name: 'chainId', maxLength: 32 },
    { name: 'groupId', maxLength: 32 },
    { name: 'extraData' },
];
var allowedTransactionKeys = {
    nonce: true,
    gasPrice: true,
    gasLimit: true,
    blockLimit: true,
    to: true,
    value: true,
    data: true,
    chainId: true,
    groupId: true,
    extraData: true,
};
///////////////////////////////
function handleAddress(value) {
    if (value === '0x') {
        return null;
    }
    return address_1.getAddress(value);
}
function handleNumber(value) {
    if (value === '0x') {
        return constants_1.Zero;
    }
    return bignumber_1.BigNumber.from(value);
}
///////////////////////////////
function computeAddress(key) {
    var publicKey = signing_key_1.computePublicKey(key);
    return address_1.getAddress(bytes_1.hexDataSlice(keccak256_1.keccak256(bytes_1.hexDataSlice(publicKey, 1)), 12));
}
exports.computeAddress = computeAddress;
function recoverAddress(digest, signature) {
    return computeAddress(signing_key_1.recoverPublicKey(bytes_1.arrayify(digest), signature));
}
exports.recoverAddress = recoverAddress;
function serialize(transaction, signature) {
    properties_1.checkProperties(transaction, allowedTransactionKeys);
    var raw = [];
    transactionFields.forEach(function (fieldInfo) {
        var value = transaction[fieldInfo.name] || ([]);
        var options = {};
        if (fieldInfo.numeric) {
            options.hexPad = 'left';
        }
        value = bytes_1.arrayify(bytes_1.hexlify(value, options));
        // Fixed-width field
        if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
            logger.throwArgumentError('invalid length for ' + fieldInfo.name, ('transaction:' + fieldInfo.name), value);
        }
        // Variable-width (with a maximum)
        if (fieldInfo.maxLength) {
            value = bytes_1.stripZeros(value);
            if (value.length > fieldInfo.maxLength) {
                logger.throwArgumentError('invalid length for ' + fieldInfo.name, ('transaction:' + fieldInfo.name), value);
            }
        }
        raw.push(bytes_1.hexlify(value));
    });
    // Requesting an unsigned transation
    if (!signature) {
        return RLP.encode(raw);
    }
    // The splitSignature will ensure the transaction has a recoveryParam in the
    // case that the signTransaction function only adds a v.
    var sig = bytes_1.splitSignature(signature);
    // We pushed a chainId and null r, s on for hashing only; remove those
    var v = 27 + sig.recoveryParam;
    raw.push(bytes_1.hexlify(v));
    raw.push(bytes_1.stripZeros(bytes_1.arrayify(sig.r)));
    raw.push(bytes_1.stripZeros(bytes_1.arrayify(sig.s)));
    return RLP.encode(raw);
}
exports.serialize = serialize;
function parse(rawTransaction) {
    var transaction = RLP.decode(rawTransaction);
    if (transaction.length !== 13 && transaction.length !== 10) {
        logger.throwArgumentError('invalid raw transaction', 'rawTransaction', rawTransaction);
    }
    var tx = {
        nonce: handleNumber(transaction[0]),
        gasPrice: handleNumber(transaction[1]),
        gasLimit: handleNumber(transaction[2]),
        blockLimit: handleNumber(transaction[3]),
        to: handleAddress(transaction[4]),
        value: handleNumber(transaction[5]),
        data: transaction[6],
        chainId: handleNumber(transaction[7]).toNumber(),
        groupId: handleNumber(transaction[8]).toNumber(),
        extraData: transaction[9],
    };
    // Legacy unsigned transaction
    if (transaction.length === 10) {
        return tx;
    }
    try {
        tx.v = bignumber_1.BigNumber.from(transaction[10]).toNumber();
    }
    catch (error) {
        console.log(error);
        return tx;
    }
    tx.r = bytes_1.hexZeroPad(transaction[11], 32);
    tx.s = bytes_1.hexZeroPad(transaction[12], 32);
    // Signed Tranasaction
    var recoveryParam = tx.v - 27;
    var raw = transaction.slice(0, 10);
    var digest = keccak256_1.keccak256(RLP.encode(raw));
    try {
        tx.from = recoverAddress(digest, { r: bytes_1.hexlify(tx.r), s: bytes_1.hexlify(tx.s), recoveryParam: recoveryParam });
    }
    catch (error) {
        console.log(error);
    }
    tx.hash = keccak256_1.keccak256(rawTransaction);
    return tx;
}
exports.parse = parse;

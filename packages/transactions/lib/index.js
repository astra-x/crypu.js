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
exports.parse = exports.serializeRc2 = exports.serializeEthers = exports.recoverAddress = exports.computeAddress = void 0;
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
var transactionFieldsEthers = [
    { name: 'nonce', maxLength: 32, numeric: true },
    { name: 'gasPrice', maxLength: 32, numeric: true },
    { name: 'gasLimit', maxLength: 32, numeric: true },
    { name: 'to', length: 20 },
    { name: 'value', maxLength: 32, numeric: true },
    { name: 'data' },
];
var allowedTransactionKeysEthers = {
    nonce: true,
    gasPrice: true,
    gasLimit: true,
    to: true,
    value: true,
    data: true,
};
var transactionFieldsRc2 = [
    { name: 'nonce', maxLength: 32, numeric: true },
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
var allowedTransactionKeysRc2 = {
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
function serializeEthers(transaction, signature) {
    console.log('serializeEthers');
    properties_1.checkProperties(transaction, allowedTransactionKeysEthers);
    var raw = [];
    transactionFieldsEthers.forEach(function (fieldInfo) {
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
    var chainId = 0;
    if (transaction.chainId != null) {
        // A chainId was provided; if non-zero we'll use EIP-155
        chainId = transaction.chainId;
        if (typeof (chainId) !== "number") {
            logger.throwArgumentError("invalid transaction.chainId", "transaction", transaction);
        }
    }
    else if (signature && !bytes_1.isBytesLike(signature) && signature.v > 28) {
        // No chainId provided, but the signature is signing with EIP-155; derive chainId
        chainId = Math.floor((signature.v - 35) / 2);
    }
    // We have an EIP-155 transaction (chainId was specified and non-zero)
    if (chainId !== 0) {
        raw.push(bytes_1.hexlify(chainId));
        raw.push("0x");
        raw.push("0x");
    }
    // Requesting an unsigned transation
    if (!signature) {
        return RLP.encode(raw);
    }
    // The splitSignature will ensure the transaction has a recoveryParam in the
    // case that the signTransaction function only adds a v.
    var sig = bytes_1.splitSignature(signature);
    // We pushed a chainId and null r, s on for hashing only; remove those
    var v = 27 + sig.recoveryParam;
    if (chainId !== 0) {
        raw.pop();
        raw.pop();
        raw.pop();
        v += chainId * 2 + 8;
        // If an EIP-155 v (directly or indirectly; maybe _vs) was provided, check it!
        if (sig.v > 28 && sig.v !== v) {
            logger.throwArgumentError("transaction.chainId/signature.v mismatch", "signature", signature);
        }
    }
    else if (sig.v !== v) {
        logger.throwArgumentError("transaction.chainId/signature.v mismatch", "signature", signature);
    }
    raw.push(bytes_1.hexlify(v));
    raw.push(bytes_1.stripZeros(bytes_1.arrayify(sig.r)));
    raw.push(bytes_1.stripZeros(bytes_1.arrayify(sig.s)));
    return RLP.encode(raw);
}
exports.serializeEthers = serializeEthers;
function serializeRc2(transaction, signature) {
    console.log('serializeRc2');
    properties_1.checkProperties(transaction, allowedTransactionKeysRc2);
    var raw = [];
    transactionFieldsRc2.forEach(function (fieldInfo) {
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
exports.serializeRc2 = serializeRc2;
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

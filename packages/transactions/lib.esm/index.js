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
import { arrayify, hexDataSlice, hexlify, hexZeroPad, isBytesLike, stripZeros, splitSignature, } from '@ethersproject/bytes';
import { keccak256 } from '@ethersproject/keccak256';
import { checkProperties } from '@ethersproject/properties';
import { BigNumber, } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import * as RLP from '@ethersproject/rlp';
import { getAddress } from '@ethersproject/address';
import { computePublicKey, recoverPublicKey, } from '@ethersproject/signing-key';
///////////////////////////////
const logger = new Logger('transactions');
const transactionFieldsEthers = [
    { name: 'nonce', maxLength: 32, numeric: true },
    { name: 'gasPrice', maxLength: 32, numeric: true },
    { name: 'gasLimit', maxLength: 32, numeric: true },
    { name: 'to', length: 20 },
    { name: 'value', maxLength: 32, numeric: true },
    { name: 'data' },
];
const allowedTransactionKeysEthers = {
    nonce: true,
    gasPrice: true,
    gasLimit: true,
    to: true,
    value: true,
    data: true,
    chainId: true,
};
const transactionFieldsRc2 = [
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
const allowedTransactionKeysRc2 = {
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
    return getAddress(value);
}
function handleNumber(value) {
    if (value === '0x') {
        return Zero;
    }
    return BigNumber.from(value);
}
///////////////////////////////
export function computeAddress(key) {
    const publicKey = computePublicKey(key);
    return getAddress(hexDataSlice(keccak256(hexDataSlice(publicKey, 1)), 12));
}
export function recoverAddress(digest, signature) {
    return computeAddress(recoverPublicKey(arrayify(digest), signature));
}
export function serializeEthers(transaction, signature) {
    checkProperties(transaction, allowedTransactionKeysEthers);
    const raw = [];
    transactionFieldsEthers.forEach(function (fieldInfo) {
        let value = transaction[fieldInfo.name] || ([]);
        const options = {};
        if (fieldInfo.numeric) {
            options.hexPad = 'left';
        }
        value = arrayify(hexlify(value, options));
        // Fixed-width field
        if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
            logger.throwArgumentError('invalid length for ' + fieldInfo.name, ('transaction:' + fieldInfo.name), value);
        }
        // Variable-width (with a maximum)
        if (fieldInfo.maxLength) {
            value = stripZeros(value);
            if (value.length > fieldInfo.maxLength) {
                logger.throwArgumentError('invalid length for ' + fieldInfo.name, ('transaction:' + fieldInfo.name), value);
            }
        }
        raw.push(hexlify(value));
    });
    let chainId = 0;
    if (transaction.chainId != null) {
        // A chainId was provided; if non-zero we'll use EIP-155
        chainId = transaction.chainId;
        if (typeof (chainId) !== 'number') {
            logger.throwArgumentError('invalid transaction.chainId', 'transaction', transaction);
        }
    }
    else if (signature && !isBytesLike(signature) && signature.v > 28) {
        // No chainId provided, but the signature is signing with EIP-155; derive chainId
        chainId = Math.floor((signature.v - 35) / 2);
    }
    // We have an EIP-155 transaction (chainId was specified and non-zero)
    if (chainId !== 0) {
        raw.push(hexlify(chainId));
        raw.push('0x');
        raw.push('0x');
    }
    // Requesting an unsigned transation
    if (!signature) {
        return RLP.encode(raw);
    }
    // The splitSignature will ensure the transaction has a recoveryParam in the
    // case that the signTransaction function only adds a v.
    const sig = splitSignature(signature);
    // We pushed a chainId and null r, s on for hashing only; remove those
    let v = 27 + sig.recoveryParam;
    if (chainId !== 0) {
        raw.pop();
        raw.pop();
        raw.pop();
        v += chainId * 2 + 8;
        // If an EIP-155 v (directly or indirectly; maybe _vs) was provided, check it!
        if (sig.v > 28 && sig.v !== v) {
            logger.throwArgumentError('transaction.chainId/signature.v mismatch', 'signature', signature);
        }
    }
    else if (sig.v !== v) {
        logger.throwArgumentError('transaction.chainId/signature.v mismatch', 'signature', signature);
    }
    raw.push(hexlify(v));
    raw.push(stripZeros(arrayify(sig.r)));
    raw.push(stripZeros(arrayify(sig.s)));
    return RLP.encode(raw);
}
export function serializeRc2(transaction, signature) {
    checkProperties(transaction, allowedTransactionKeysRc2);
    const raw = [];
    transactionFieldsRc2.forEach(function (fieldInfo) {
        let value = transaction[fieldInfo.name] || ([]);
        const options = {};
        if (fieldInfo.numeric) {
            options.hexPad = 'left';
        }
        value = arrayify(hexlify(value, options));
        // Fixed-width field
        if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
            logger.throwArgumentError('invalid length for ' + fieldInfo.name, ('transaction:' + fieldInfo.name), value);
        }
        // Variable-width (with a maximum)
        if (fieldInfo.maxLength) {
            value = stripZeros(value);
            if (value.length > fieldInfo.maxLength) {
                logger.throwArgumentError('invalid length for ' + fieldInfo.name, ('transaction:' + fieldInfo.name), value);
            }
        }
        raw.push(hexlify(value));
    });
    // Requesting an unsigned transation
    if (!signature) {
        return RLP.encode(raw);
    }
    // The splitSignature will ensure the transaction has a recoveryParam in the
    // case that the signTransaction function only adds a v.
    const sig = splitSignature(signature);
    // We pushed a chainId and null r, s on for hashing only; remove those
    const v = 27 + sig.recoveryParam;
    raw.push(hexlify(v));
    raw.push(stripZeros(arrayify(sig.r)));
    raw.push(stripZeros(arrayify(sig.s)));
    return RLP.encode(raw);
}
export function parse(rawTransaction) {
    const transaction = RLP.decode(rawTransaction);
    if (transaction.length === 9 || transaction.length === 6) {
        return parseEthers(rawTransaction, transaction);
    }
    else if (transaction.length === 13 || transaction.length === 10) {
        return parseRc2(rawTransaction, transaction);
    }
    return logger.throwArgumentError('invalid raw transaction', 'rawTransaction', rawTransaction);
}
function parseEthers(rawTransaction, transaction) {
    const tx = {
        nonce: handleNumber(transaction[0]),
        gasPrice: handleNumber(transaction[1]),
        gasLimit: handleNumber(transaction[2]),
        to: handleAddress(transaction[3]),
        value: handleNumber(transaction[4]),
        data: transaction[5],
        chainId: 0
    };
    // Legacy unsigned transaction
    if (transaction.length === 6) {
        return tx;
    }
    try {
        tx.v = BigNumber.from(transaction[6]).toNumber();
    }
    catch (error) {
        console.log(error);
        return tx;
    }
    tx.r = hexZeroPad(transaction[7], 32);
    tx.s = hexZeroPad(transaction[8], 32);
    if (BigNumber.from(tx.r).isZero() && BigNumber.from(tx.s).isZero()) {
        // EIP-155 unsigned transaction
        tx.chainId = tx.v;
        tx.v = 0;
    }
    else {
        // Signed Tranasaction
        tx.chainId = Math.floor((tx.v - 35) / 2);
        if (tx.chainId < 0) {
            tx.chainId = 0;
        }
        let recoveryParam = tx.v - 27;
        const raw = transaction.slice(0, 6);
        if (tx.chainId !== 0) {
            raw.push(hexlify(tx.chainId));
            raw.push('0x');
            raw.push('0x');
            recoveryParam -= tx.chainId * 2 + 8;
        }
        const digest = keccak256(RLP.encode(raw));
        try {
            tx.from = recoverAddress(digest, { r: hexlify(tx.r), s: hexlify(tx.s), recoveryParam: recoveryParam });
        }
        catch (error) {
            console.log(error);
        }
        tx.hash = keccak256(rawTransaction);
    }
    return tx;
}
function parseRc2(rawTransaction, transaction) {
    const tx = {
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
        tx.v = BigNumber.from(transaction[10]).toNumber();
    }
    catch (error) {
        console.log(error);
        return tx;
    }
    tx.r = hexZeroPad(transaction[11], 32);
    tx.s = hexZeroPad(transaction[12], 32);
    // Signed Tranasaction
    let recoveryParam = tx.v - 27;
    const raw = transaction.slice(0, 10);
    const digest = keccak256(RLP.encode(raw));
    try {
        tx.from = recoverAddress(digest, { r: hexlify(tx.r), s: hexlify(tx.s), recoveryParam: recoveryParam });
    }
    catch (error) {
        console.log(error);
    }
    tx.hash = keccak256(rawTransaction);
    return tx;
}

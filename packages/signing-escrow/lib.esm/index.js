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
import { arrayify, } from '@ethersproject/bytes';
import { defineReadOnly } from '@ethersproject/properties';
import { getAddress } from '@ethersproject/address';
import { fetchJson, } from '@crypujs/web';
const _privateKeyFake = '0x';
const logger = new Logger('signing-escrow');
export class SigningEscrow {
    constructor(connection, address) {
        this._nextId = 927;
        defineReadOnly(this, 'connection', connection);
        defineReadOnly(this, "curve", "secp256k1");
        defineReadOnly(this, 'address', getAddress(address));
        defineReadOnly(this, 'privateKey', _privateKeyFake);
        const json = {
            id: (this._nextId++),
            jsonrpc: '2.0',
            method: 'eoa_retrieve',
            params: [this.address],
        };
        fetchJson(this.connection, JSON.stringify(json), this.getResult).then((result) => {
            defineReadOnly(this, 'publicKey', result.publicKey);
            defineReadOnly(this, 'compressedPublicKey', result.compressedPublicKey);
        }).catch((error) => {
            logger.throwError('processing response error', Logger.errors.SERVER_ERROR, {
                body: json,
                error: error,
                url: this.connection.url,
            });
        });
        defineReadOnly(this, '_isSigningEscrow', true);
    }
    signDigest(digest) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = {
                id: (this._nextId++),
                jsonrpc: '2.0',
                method: 'signDigest',
                params: [this.address, arrayify(digest)],
            };
            const { signature } = yield fetchJson(this.connection, JSON.stringify(json), this.getResult);
            return signature;
        });
    }
    getResult(payload) {
        return payload.result;
    }
    static isSigningEscrow(value) {
        return !!(value && value._isSigningEscrow);
    }
}

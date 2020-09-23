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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigningEscrow = void 0;
var logger_1 = require("@ethersproject/logger");
var bytes_1 = require("@ethersproject/bytes");
var properties_1 = require("@ethersproject/properties");
var address_1 = require("@ethersproject/address");
var web_1 = require("@crypujs/web");
var _privateKeyFake = '0x';
var logger = new logger_1.Logger('signing-escrow');
var SigningEscrow = /** @class */ (function () {
    function SigningEscrow(connection, address) {
        var _this = this;
        this._nextId = 927;
        properties_1.defineReadOnly(this, 'connection', connection);
        properties_1.defineReadOnly(this, "curve", "secp256k1");
        properties_1.defineReadOnly(this, 'address', address_1.getAddress(address));
        properties_1.defineReadOnly(this, 'privateKey', _privateKeyFake);
        var json = {
            id: (this._nextId++),
            jsonrpc: '2.0',
            method: 'eoa_retrieve',
            params: [this.address],
        };
        web_1.fetchJson(this.connection, JSON.stringify(json), this.getResult).then(function (result) {
            properties_1.defineReadOnly(_this, 'publicKey', result.publicKey);
            properties_1.defineReadOnly(_this, 'compressedPublicKey', result.compressedPublicKey);
        }).catch(function (error) {
            logger.throwError('processing response error', logger_1.Logger.errors.SERVER_ERROR, {
                body: json,
                error: error,
                url: _this.connection.url,
            });
        });
        properties_1.defineReadOnly(this, '_isSigningEscrow', true);
    }
    SigningEscrow.prototype.signDigest = function (digest) {
        return __awaiter(this, void 0, void 0, function () {
            var json, signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json = {
                            id: (this._nextId++),
                            jsonrpc: '2.0',
                            method: 'signDigest',
                            params: [this.address, bytes_1.arrayify(digest)],
                        };
                        return [4 /*yield*/, web_1.fetchJson(this.connection, JSON.stringify(json), this.getResult)];
                    case 1:
                        signature = (_a.sent()).signature;
                        return [2 /*return*/, signature];
                }
            });
        });
    };
    SigningEscrow.prototype.getResult = function (payload) {
        return payload.result;
    };
    SigningEscrow.isSigningEscrow = function (value) {
        return !!(value && value._isSigningEscrow);
    };
    return SigningEscrow;
}());
exports.SigningEscrow = SigningEscrow;

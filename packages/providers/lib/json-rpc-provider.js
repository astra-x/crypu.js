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
 * @file json-rpc-provider.ts
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
exports.JsonRpcProvider = void 0;
var logger_1 = require("@ethersproject/logger");
var networks_1 = require("@ethersproject/networks");
var properties_1 = require("@ethersproject/properties");
var web_1 = require("@crypujs/web");
var constants_1 = require("./constants");
var ethers_api_1 = require("./api/ethers.api");
var fisco_api_1 = require("./api/fisco.api");
var formatter_1 = require("./formatter");
var base_provider_1 = require("./base-provider");
var logger = new logger_1.Logger('provider');
var defaultUrl = 'http://localhost:8545';
var defaultNetwork = {
    chainId: 1,
    name: 'fisco',
};
var defaultFormatter;
var JsonRpcProvider = /** @class */ (function (_super) {
    __extends(JsonRpcProvider, _super);
    function JsonRpcProvider(chain, url, network, groupId) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, network || properties_1.getStatic((_newTarget), 'defaultNetwork')(), groupId || 1) || this;
        logger.checkNew(_newTarget, JsonRpcProvider);
        if (!url) {
            url = properties_1.getStatic((_newTarget), 'defaultUrl')();
        }
        properties_1.defineReadOnly(_this, 'connection', { url: url });
        switch (chain) {
            case constants_1.Chain.ETHERS: {
                properties_1.defineReadOnly(_this, 'detectChainId', ethers_api_1.Api.detectChainId(_this.send.bind(_this)));
                properties_1.defineReadOnly(_this, 'prepareRequest', ethers_api_1.Api.prepareRequest);
                break;
            }
            case constants_1.Chain.FISCO: {
                properties_1.defineReadOnly(_this, 'detectChainId', fisco_api_1.Api.detectChainId(_this.send.bind(_this)));
                properties_1.defineReadOnly(_this, 'prepareRequest', fisco_api_1.Api.prepareRequest(_this.groupId));
                break;
            }
        }
        _this._nextId = 42;
        return _this;
    }
    JsonRpcProvider.defaultUrl = function () {
        return defaultUrl;
    };
    JsonRpcProvider.defaultNetwork = function () {
        return Promise.resolve(defaultNetwork);
    };
    JsonRpcProvider.getFormatter = function () {
        if (defaultFormatter == null) {
            defaultFormatter = new formatter_1.Formatter();
        }
        return defaultFormatter;
    };
    JsonRpcProvider.getNetwork = function (network) {
        return networks_1.getNetwork((network == null) ? defaultNetwork : network);
    };
    JsonRpcProvider.prototype.detectNetwork = function () {
        return __awaiter(this, void 0, void 0, function () {
            var network, chainId, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        network = this.network;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, this.detectChainId()];
                    case 2:
                        chainId = _a.sent();
                        if (chainId) {
                            network.chainId = Number(chainId);
                        }
                        else {
                            throw new Error('could not detect network');
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, logger.throwError('could not detect network', logger_1.Logger.errors.NETWORK_ERROR, {
                                event: 'noNetwork',
                                serverError: error_1,
                            })];
                    case 4: return [2 /*return*/, properties_1.getStatic(this.constructor, 'getNetwork')(network)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    JsonRpcProvider.prototype.getResult = function (payload) {
        return payload.result;
    };
    JsonRpcProvider.prototype.send = function (method, params) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            var _this = this;
            return __generator(this, function (_a) {
                request = {
                    id: (this._nextId++),
                    jsonrpc: '2.0',
                    method: method,
                    params: params,
                };
                this.emit('debug', {
                    action: 'request',
                    request: properties_1.deepCopy(request),
                    provider: this,
                });
                return [2 /*return*/, web_1.fetchJson(this.connection, JSON.stringify(request), this.getResult).then(function (result) {
                        _this.emit('debug', {
                            action: 'response',
                            request: request,
                            response: result,
                            provider: _this,
                        });
                        return result;
                    }, function (error) {
                        _this.emit('debug', {
                            action: 'response',
                            request: request,
                            error: error,
                            provider: _this,
                        });
                        return error;
                    })];
            });
        });
    };
    JsonRpcProvider.prototype.perform = function (method, params) {
        return __awaiter(this, void 0, void 0, function () {
            var args;
            return __generator(this, function (_a) {
                args = this.prepareRequest(method, params);
                if (!!args) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, this.send(args[0], args[1])];
            });
        });
    };
    return JsonRpcProvider;
}(base_provider_1.BaseProvider));
exports.JsonRpcProvider = JsonRpcProvider;

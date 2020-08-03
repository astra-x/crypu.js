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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _nextId;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcProvider = void 0;
const logger_1 = require("@ethersproject/logger");
const networks_1 = require("@ethersproject/networks");
const properties_1 = require("@ethersproject/properties");
const web_1 = require("@ethersproject/web");
const formatter_1 = require("./formatter");
const base_provider_1 = require("./base-provider");
const logger = new logger_1.Logger('provider');
const defaultUrl = 'http://localhost:8545';
const defaultNetwork = {
    chainId: 1,
    name: 'fisco-bcos',
};
let defaultFormatter;
class JsonRpcProvider extends base_provider_1.BaseProvider {
    constructor(url, network, groupId) {
        super(network || properties_1.getStatic((new.target), 'defaultNetwork')(), groupId || 1);
        _nextId.set(this, void 0);
        logger.checkNew(new.target, JsonRpcProvider);
        if (!url) {
            url = properties_1.getStatic((new.target), 'defaultUrl')();
        }
        this.connection = { url: url };
        __classPrivateFieldSet(this, _nextId, 42);
    }
    static defaultUrl() {
        return defaultUrl;
    }
    static defaultNetwork() {
        return Promise.resolve(defaultNetwork);
    }
    static getFormatter() {
        if (defaultFormatter == null) {
            defaultFormatter = new formatter_1.Formatter();
        }
        return defaultFormatter;
    }
    static getNetwork(network) {
        return networks_1.getNetwork((network == null) ? defaultNetwork : network);
    }
    async detectNetwork() {
        let network = await properties_1.getStatic(this.constructor, 'defaultNetwork')();
        try {
            const clientVersion = await this.send('getClientVersion', []);
            const chainId = clientVersion === null || clientVersion === void 0 ? void 0 : clientVersion.result['Chain Id'];
            if (chainId) {
                network.chainId = Number(chainId);
            }
            else {
                throw new Error('could not detect network');
            }
        }
        catch (error) {
            return logger.throwError('could not detect network', logger_1.Logger.errors.NETWORK_ERROR, {
                event: 'noNetwork',
                serverError: error,
            });
        }
        finally {
            return properties_1.getStatic(this.constructor, 'getNetwork')(network);
        }
    }
    getResult(payload) {
        return payload.result;
    }
    prepareRequest(method, params) {
        switch (method) {
            case 'getClientVersion':
                return ['getClientVersion', []];
            case 'getPbftView':
                return ['getPbftView', [this.groupId]];
            case 'getSealerList':
                return ['getSealerList', [this.groupId]];
            case 'getObserverList':
                return ['getObserverList', [this.groupId]];
            case 'getSyncStatus':
                return ['getSyncStatus', [this.groupId]];
            case 'getPeers':
                return ['getPeers', [this.groupId]];
            case 'getNodeIdList':
                return ['getNodeIDList', [this.groupId]];
            case 'getGroupList':
                return ['getGroupList', [this.groupId]];
            case 'getBlockNumber':
                return ['getBlockNumber', [this.groupId]];
            case 'getBlock':
                if (params.blockTag) {
                    return ['getBlockByNumber', [this.groupId, params.blockTag, !!params.includeTransactions]];
                }
                else if (params.blockHash) {
                    return ['getBlockByHash', [this.groupId, params.blockHash, !!params.includeTransactions]];
                }
                break;
            case 'sendTransaction':
                return ['sendRawTransaction', [this.groupId, params.signedTransaction]];
            case 'getTransaction':
                return ['getTransactionByHash', [this.groupId, params.transactionHash]];
            case 'getTransactionReceipt':
                return ['getTransactionReceipt', [this.groupId, params.transactionHash]];
            default:
                logger.throwError(method + ' not implemented', logger_1.Logger.errors.NOT_IMPLEMENTED, { operation: method });
        }
        return ['', []];
    }
    async send(method, params) {
        var _a;
        const request = {
            id: (__classPrivateFieldSet(this, _nextId, (_a = +__classPrivateFieldGet(this, _nextId)) + 1), _a),
            jsonrpc: '2.0',
            method: method,
            params: params,
        };
        this.emit('debug', {
            action: 'request',
            request: properties_1.deepCopy(request),
            provider: this,
        });
        return web_1.fetchJson(this.connection, JSON.stringify(request), this.getResult).then((result) => {
            this.emit('debug', {
                action: 'response',
                request: request,
                response: result,
                provider: this,
            });
            return result;
        }, (error) => {
            this.emit('debug', {
                action: 'response',
                request: request,
                error: error,
                provider: this,
            });
            return error;
        });
    }
    async perform(method, params) {
        let args = this.prepareRequest(method, params);
        return this.send(args[0], args[1]);
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
_nextId = new WeakMap();

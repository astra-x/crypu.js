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
import { getNetwork, } from '@ethersproject/networks';
import { deepCopy, defineReadOnly, getStatic, } from '@ethersproject/properties';
import { fetchJson } from '@crypujs/web';
import { Chain } from './constants';
import { Formatter } from './formatter';
import { BaseProvider } from './base-provider';
const logger = new Logger('provider');
const defaultUrl = 'http://localhost:8545';
const defaultNetwork = {
    chainId: 1,
    name: 'ethers',
};
let defaultFormatter;
export class JsonRpcProvider extends BaseProvider {
    constructor(chain, url, network, groupId) {
        super(network || getStatic((new.target), 'defaultNetwork')(), groupId || 1);
        logger.checkNew(new.target, JsonRpcProvider);
        if (!url) {
            url = getStatic((new.target), 'defaultUrl')();
        }
        defineReadOnly(this, 'connection', { url: url });
        defineReadOnly(this, 'getChainId', getStatic((new.target), 'getChainId')(chain, this.send.bind(this)));
        defineReadOnly(this, 'prepareRequest', getStatic((new.target), 'prepareRequest')(chain, this.network, this.groupId));
        this._nextId = 42;
    }
    static getFormatter() {
        if (defaultFormatter == null) {
            defaultFormatter = new Formatter();
        }
        return defaultFormatter;
    }
    static defaultUrl() {
        return defaultUrl;
    }
    static defaultNetwork() {
        return Promise.resolve(defaultNetwork);
    }
    static getNetwork(network) {
        return getNetwork((network == null) ? defaultNetwork : network);
    }
    static getChainId(chain, send) {
        switch (chain) {
            case Chain.ETHERS:
                return () => send('eth_chainId', []);
            case Chain.FISCO:
                return () => send('getClientVersion', []).then((clientVersion) => Number(clientVersion['Chain Id']));
        }
        return logger.throwArgumentError('invalid chain', 'chain', chain);
    }
    static prepareRequest(chain, _, groupId) {
        switch (chain) {
            case Chain.ETHERS:
                return (method, params) => {
                    switch (method) {
                        case 'getBlockNumber':
                            return ['eth_blockNumber', []];
                        case 'getGasPrice':
                            return ['eth_gasPrice', []];
                        case 'getBalance':
                            return ['eth_getBalance', [params.address.toLowerCase(), params.blockTag]];
                        case 'getTransactionCount':
                            return ['eth_getTransactionCount', [params.address.toLowerCase(), params.blockTag]];
                        case 'getCode':
                            return ['eth_getCode', [params.address.toLowerCase(), params.blockTag]];
                        case 'getStorageAt':
                            return ['eth_getStorageAt', [params.address.toLowerCase(), params.position, params.blockTag]];
                        case 'sendTransaction':
                            return ['eth_sendRawTransaction', [params.signedTransaction]];
                        case 'getBlock':
                            if (params.blockTag) {
                                return ['eth_getBlockByNumber', [params.blockTag, !!params.includeTransactions]];
                            }
                            else if (params.blockHash) {
                                return ['eth_getBlockByHash', [params.blockHash, !!params.includeTransactions]];
                            }
                            return null;
                        case 'getTransaction':
                            return ['eth_getTransactionByHash', [params.transactionHash]];
                        case 'getTransactionReceipt':
                            return ['eth_getTransactionReceipt', [params.transactionHash]];
                        case 'call': {
                            return ['eth_call', [params.transaction, params.blockTag]];
                        }
                        case 'estimateGas': {
                            return ['eth_estimateGas', [params.transaction]];
                        }
                        case 'getLogs':
                            if (params.filter && params.filter.address != null) {
                                params.filter.address = params.filter.address.toLowerCase();
                            }
                            return ['eth_getLogs', [params.filter]];
                    }
                    return null;
                };
            case Chain.FISCO:
                return (method, params) => {
                    switch (method) {
                        case 'getClientVersion':
                            return ['getClientVersion', []];
                        case 'getPbftView':
                            return ['getPbftView', [groupId]];
                        case 'getSealerList':
                            return ['getSealerList', [groupId]];
                        case 'getObserverList':
                            return ['getObserverList', [groupId]];
                        case 'getSyncStatus':
                            return ['getSyncStatus', [groupId]];
                        case 'getPeers':
                            return ['getPeers', [groupId]];
                        case 'getNodeIdList':
                            return ['getNodeIDList', [groupId]];
                        case 'getGroupList':
                            return ['getGroupList', [groupId]];
                        case 'getBlockNumber':
                            return ['getBlockNumber', [groupId]];
                        case 'getBlock':
                            if (params.blockTag) {
                                return ['getBlockByNumber', [groupId, params.blockTag, !!params.includeTransactions]];
                            }
                            else if (params.blockHash) {
                                return ['getBlockByHash', [groupId, params.blockHash, !!params.includeTransactions]];
                            }
                            break;
                        case 'sendTransaction':
                            return ['sendRawTransaction', [groupId, params.signedTransaction]];
                        case 'getTransaction':
                            return ['getTransactionByHash', [groupId, params.transactionHash]];
                        case 'getTransactionReceipt':
                            return ['getTransactionReceipt', [groupId, params.transactionHash]];
                        case 'call':
                            return ['call', [groupId, params.transaction]];
                    }
                    return null;
                };
        }
        return logger.throwArgumentError('invalid chain', 'chain', chain);
    }
    detectNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            let network = this.network;
            try {
                const chainId = yield this.getChainId();
                if (chainId) {
                    network.chainId = Number(chainId);
                }
                else {
                    throw new Error('could not detect network');
                }
            }
            catch (error) {
                return logger.throwError('could not detect network', Logger.errors.NETWORK_ERROR, {
                    event: 'noNetwork',
                    serverError: error,
                });
            }
            finally {
                return getStatic(this.constructor, 'getNetwork')(network);
            }
        });
    }
    result(payload) {
        return payload.result;
    }
    send(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                id: (this._nextId++),
                jsonrpc: '2.0',
                method: method,
                params: params,
            };
            this.emit('debug', {
                action: 'request',
                request: deepCopy(request),
                provider: this,
            });
            return fetchJson(this.connection, JSON.stringify(request), this.result).then((result) => {
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
        });
    }
    perform(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let args = this.prepareRequest(method, params);
            if (!args) {
                return null;
            }
            return this.send(args[0], args[1]);
        });
    }
}

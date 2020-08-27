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
import { Api as EthersApi } from './api/ethers.api';
import { Api as FiscoApi } from './api/fisco.api';
import { Formatter } from './formatter';
import { BaseProvider } from './base-provider';
const logger = new Logger('provider');
const defaultUrl = 'http://localhost:8545';
const defaultNetwork = {
    chainId: 1,
    name: 'fisco',
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
        switch (chain) {
            case Chain.ETHERS: {
                defineReadOnly(this, 'detectChainId', EthersApi.detectChainId(this.send.bind(this)));
                defineReadOnly(this, 'prepareRequest', EthersApi.prepareRequest);
                break;
            }
            case Chain.FISCO: {
                defineReadOnly(this, 'detectChainId', FiscoApi.detectChainId(this.send.bind(this)));
                defineReadOnly(this, 'prepareRequest', FiscoApi.prepareRequest(this.groupId));
                break;
            }
        }
        this._nextId = 42;
    }
    static defaultUrl() {
        return defaultUrl;
    }
    static defaultNetwork() {
        return Promise.resolve(defaultNetwork);
    }
    static getFormatter() {
        if (defaultFormatter == null) {
            defaultFormatter = new Formatter();
        }
        return defaultFormatter;
    }
    static getNetwork(network) {
        return getNetwork((network == null) ? defaultNetwork : network);
    }
    detectNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            let network = this.network;
            try {
                const chainId = yield this.detectChainId();
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
    getResult(payload) {
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
            return fetchJson(this.connection, JSON.stringify(request), this.getResult).then((result) => {
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

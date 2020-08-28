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

import { Logger } from '@ethersproject/logger';
import {
  Networkish,
  Network,
  getNetwork,
} from '@ethersproject/networks';
import {
  deepCopy,
  defineReadOnly,
  getStatic,
} from '@ethersproject/properties'

import { fetchJson } from '@crypujs/web';
import { ClientVersion } from '@crypujs/abstract-provider';

import { Chain } from './constants';
import { Response } from './dto/response.dto';
import { Formatter } from './formatter';
import { BaseProvider } from './base-provider';

const logger = new Logger('provider');
const defaultUrl: string = 'http://localhost:8545';
const defaultNetwork: Network = {
  chainId: 1,
  name: 'ethers',
};
let defaultFormatter: Formatter;

interface Connection {
  url: string;
}

export class JsonRpcProvider extends BaseProvider {
  _nextId: number;
  readonly connection: Connection;

  // compatible for ethers and fisco
  readonly getChainId: () => Promise<number>;
  readonly prepareRequest: (method: string, params: any) => [string, Array<any>];

  constructor(chain: Chain, url?: string, network?: Network | Promise<Network>, groupId?: number) {
    super(network || getStatic<() => Promise<Network>>(new.target, 'defaultNetwork')(), groupId || 1);

    logger.checkNew(new.target, JsonRpcProvider);

    if (!url) {
      url = getStatic<() => string>(new.target, 'defaultUrl')();
    }
    defineReadOnly(this, 'connection', { url: url });
    defineReadOnly(
      this,
      'getChainId',
      getStatic<
        (
          chain: Chain,
          send: (method: string, params: Array<any>) => Promise<any>,
        ) => () => Promise<number>
        >(new.target, 'getChainId')(chain, this.send.bind(this)),
    );
    defineReadOnly(
      this,
      'prepareRequest',
      getStatic<
        (
          chain: Chain,
          network: Network,
          groupId: number,
        ) => (method: string, params: any) => [string, Array<any>]
        >(new.target, 'prepareRequest')(chain, this.network, this.groupId),
    )

    this._nextId = 42;
  }

  static getFormatter(): Formatter {
    if (defaultFormatter == null) {
      defaultFormatter = new Formatter();
    }
    return defaultFormatter;
  }

  static defaultUrl(): string {
    return defaultUrl;
  }

  static defaultNetwork(): Promise<Network> {
    return Promise.resolve(defaultNetwork);
  }

  static getNetwork(network: Networkish): Network {
    return getNetwork((network == null) ? defaultNetwork : network);
  }

  static getChainId(chain: Chain, send: (method: string, params: Array<any>) => Promise<any>): () => Promise<number> {
    switch (chain) {
      case Chain.ETHERS:
        return (): Promise<number> => send('eth_chainId', []);
      case Chain.FISCO:
        return (): Promise<number> =>
          send('getClientVersion', []).then(
            (clientVersion: ClientVersion) => Number(clientVersion['Chain Id'])
          );
    }
    return logger.throwArgumentError('invalid chain', 'chain', chain);
  }

  static prepareRequest(chain: Chain, _: Network, groupId: number): (method: string, params: any) => [string, Array<any>] {
    switch (chain) {
      case Chain.ETHERS:
        return (method: string, params: any): [string, Array<any>] => {
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
              return ['eth_sendRawTransaction', [params.signedTransaction]]
            case 'getBlock':
              if (params.blockTag) {
                return ['eth_getBlockByNumber', [params.blockTag, !!params.includeTransactions]];
              } else if (params.blockHash) {
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
        }
      case Chain.FISCO:
        return (method: string, params: any): [string, Array<any>] => {
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
              } else if (params.blockHash) {
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
        }
    }
    return logger.throwArgumentError('invalid chain', 'chain', chain);
  }

  async detectNetwork(): Promise<Network> {
    let network: Network = this.network;
    try {
      const chainId = await this.getChainId();
      if (chainId) {
        network.chainId = Number(chainId);
      } else {
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
      return getStatic<(network: Network) => Promise<Network>>(this.constructor, 'getNetwork')(network);
    }
  }

  result(payload: Response<any>): any {
    return payload.result;
  }

  async send(method: string, params: Array<any>): Promise<any> {
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
  }

  async perform(method: string, params: any): Promise<any> {
    let args = this.prepareRequest(method, params);
    if (!args) { return null; }

    return this.send(args[0], args[1]);
  }
}

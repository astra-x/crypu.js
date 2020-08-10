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

import { Response } from './dto/response.dto';
import { Formatter } from './formatter';
import {
  BaseProvider,
} from './base-provider';

const logger = new Logger('provider');
const defaultUrl: string = 'http://localhost:8545';
const defaultNetwork: Network = {
  chainId: 1,
  name: 'fisco-bcos',
};
let defaultFormatter: Formatter;

interface Connection {
  url: string;
}

export class JsonRpcProvider extends BaseProvider {
  _nextId: number;
  readonly connection: Connection;

  constructor(url?: string, network?: Network | Promise<Network>, groupId?: number) {
    super(network || getStatic<() => Promise<Network>>(new.target, 'defaultNetwork')(), groupId || 1);

    logger.checkNew(new.target, JsonRpcProvider);

    if (!url) {
      url = getStatic<() => string>(new.target, 'defaultUrl')();
    }
    defineReadOnly(this, 'connection', { url: url });

    this._nextId = 42;
  }

  static defaultUrl(): string {
    return defaultUrl;
  }

  static defaultNetwork(): Promise<Network> {
    return Promise.resolve(defaultNetwork);
  }

  static getFormatter(): Formatter {
    if (defaultFormatter == null) {
      defaultFormatter = new Formatter();
    }
    return defaultFormatter;
  }

  static getNetwork(network: Networkish): Network {
    return getNetwork((network == null) ? defaultNetwork : network);
  }

  async detectNetwork(): Promise<Network> {
    let network: Network = await getStatic<() => Promise<Network>>(this.constructor, 'defaultNetwork')();
    try {
      const clientVersion: Response<ClientVersion> = await this.send('getClientVersion', []);
      const chainId = clientVersion ?.result['Chain Id'];
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

  getResult(payload: Response<any>): any {
    return payload.result;
  }

  prepareRequest(method: string, params: any): [string, Array<any>] {
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
        } else if (params.blockHash) {
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
        logger.throwError(method + ' not implemented', Logger.errors.NOT_IMPLEMENTED, { operation: method });
    }
    return ['', []];
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
  }

  async perform(method: string, params: any): Promise<any> {
    let args = this.prepareRequest(method, params);

    return this.send(args[0], args[1]);
  }
}

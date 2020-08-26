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

import { Chain } from './constants';
import { Api as EthersApi } from './api/ethers.api';
import { Api as FiscoApi } from './api/fisco.api';
import { Response } from './dto/response.dto';
import { Formatter } from './formatter';
import { BaseProvider } from './base-provider';

const logger = new Logger('provider');
const defaultUrl: string = 'http://localhost:8545';
const defaultNetwork: Network = {
  chainId: 1,
  name: 'fisco',
};
let defaultFormatter: Formatter;

interface Connection {
  url: string;
}

export class JsonRpcProvider extends BaseProvider {
  _nextId: number;
  readonly connection: Connection;

  // compatible for ethers and fisco
  readonly detectChainId: () => Promise<number>;
  readonly prepareRequest: (method: string, params: any) => [string, Array<any>];

  constructor(chain: Chain, url?: string, network?: Network | Promise<Network>, groupId?: number) {
    super(network || getStatic<() => Promise<Network>>(new.target, 'defaultNetwork')(), groupId || 1);

    logger.checkNew(new.target, JsonRpcProvider);

    if (!url) {
      url = getStatic<() => string>(new.target, 'defaultUrl')();
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
    let network: Network = this.network;
    try {
      const chainId = await this.detectChainId();
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
    if (!!args) { return null; }

    return this.send(args[0], args[1]);
  }
}

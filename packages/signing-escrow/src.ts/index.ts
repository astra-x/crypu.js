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
import {
  BytesLike,
  Signature,
  arrayify,
} from '@ethersproject/bytes';
import { defineReadOnly } from '@ethersproject/properties';
import { getAddress } from '@ethersproject/address';

import {
  ConnectionInfo,
  fetchJson,
} from '@crypujs/web';

import { Response } from './dto/response.dto';
import { RetrieveResult } from './dto/eoa.retrieve.dto';
import { DigestResult } from './dto/sign.digest.dto';

const _privateKeyFake = '0x';
const logger = new Logger('signing-escrow');

export class SigningEscrow {
  _nextId: number = 927;
  readonly connection: ConnectionInfo;
  readonly curve: string;
  readonly address: string;
  readonly privateKey: string;
  readonly publicKey: string;
  readonly compressedPublicKey: string;

  readonly _isSigningEscrow: boolean;

  constructor(connection: ConnectionInfo, address: string) {
    defineReadOnly(this, 'connection', connection);
    defineReadOnly(this, "curve", "secp256k1");
    defineReadOnly(this, 'address', getAddress(address));
    defineReadOnly(this, 'privateKey', _privateKeyFake);

    const json = {
      id: (this._nextId++),
      jsonrpc: '2.0',
      method: 'eoa_retrieve',
      params: [this.address],
    }
    fetchJson(this.connection, JSON.stringify(json), this.getResult).then((result: RetrieveResult) => {
      defineReadOnly(this, 'publicKey', result.publicKey);
      defineReadOnly(this, 'compressedPublicKey', result.compressedPublicKey);
    }).catch((error: any) => {
      logger.throwError('processing response error', Logger.errors.SERVER_ERROR, {
        body: json,
        error: error,
        url: this.connection.url,
      });
    });

    defineReadOnly(this, '_isSigningEscrow', true);
  }

  async signDigest(digest: BytesLike): Promise<Signature> {
    const json = {
      id: (this._nextId++),
      jsonrpc: '2.0',
      method: 'signDigest',
      params: [this.address, arrayify(digest)],
    };
    const { signature }: DigestResult = await fetchJson(this.connection, JSON.stringify(json), this.getResult);
    return <Signature>signature;
  }

  private getResult<T>(payload: Response<T>): T {
    return payload.result;
  }

  static isSigningEscrow(value: any): value is SigningEscrow {
    return !!(value && value._isSigningEscrow);
  }
}

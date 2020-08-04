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
 * @file geturl.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */

'use strict';

import { Logger } from '@ethersproject/logger';

import http from 'http';
import https from 'https';
import { parse } from 'url'

const logger = new Logger('web');

export type GetUrlResponse = {
  statusCode: number,
  statusMessage: string;
  headers: { [key: string]: string };
  body: string;
};

export type Options = {
  method?: string,
  body?: string
  headers?: { [key: string]: string },
};

function getResponse(request: http.ClientRequest): Promise<GetUrlResponse> {
  return new Promise((resolve, reject) => {
    request.once('response', (resp: http.IncomingMessage) => {
      const response: GetUrlResponse = {
        statusCode: resp.statusCode,
        statusMessage: resp.statusMessage,
        headers: Object.keys(resp.headers).reduce((accum, name) => {
          let value = resp.headers[name];
          if (Array.isArray(value)) {
            value = value.join(', ');
          }
          accum[name] = value;
          return accum;
        }, <{ [name: string]: string }>{}),
        body: null
      };
      resp.setEncoding('utf8');

      resp.on('data', (chunk: string) => {
        if (response.body == null) { response.body = ''; }
        response.body += chunk;
      });

      resp.on('end', () => {
        resolve(response);
      });

      resp.on('error', (error) => {
        (<any>error).response = response;
        reject(error);
      });
    });

    request.on('error', (error) => { reject(error); });
  });
}

// The URL.parse uses null instead of the empty string
function nonnull(value: string): string {
  if (value == null) { return ''; }
  return value;
}

export async function getUrl(href: string, options?: Options): Promise<GetUrlResponse> {
  if (options == null) { options = {}; }

  // @TODO: Once we drop support for node 8, we can pass the href
  //        firectly into request and skip adding the components
  //        to this request object
  const url = parse(href);

  const request = {
    protocol: nonnull(url.protocol),
    hostname: nonnull(url.hostname),
    port: nonnull(url.port),
    path: (nonnull(url.pathname) + nonnull(url.search)),

    method: (options.method || 'GET'),
    headers: (options.headers || {}),
  };

  let req: http.ClientRequest = null;
  switch (nonnull(url.protocol)) {
    case 'http:':
      req = http.request(request);
      break;
    case 'https:':
      req = https.request(request);
      break;
    default:
      logger.throwError(`unsupported protocol ${url.protocol}`, Logger.errors.UNSUPPORTED_OPERATION, {
        protocol: url.protocol,
        operation: 'request'
      });
  }

  if (options.body) {
    req.write(options.body);
  }
  req.end();

  const response = await getResponse(req);
  return response;
}

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
 * @file browser-geturl.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */

'use strict';

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

export async function getUrl(href: string, options?: Options): Promise<GetUrlResponse> {
  if (options == null) { options = {}; }

  const request = {
    method: (options.method || 'GET'),
    headers: (options.headers || {}),
    body: (options.body || undefined),

    mode: <RequestMode>'cors',                       // no-cors, cors, *same-origin
    cache: <RequestCache>'no-cache',                 // *default, no-cache, reload, force-cache, only-if-cached
    credentials: <RequestCredentials>'same-origin',  // include, *same-origin, omit
    redirect: <RequestRedirect>'follow',             // manual, *follow, error
    referrer: 'client',         // no-referrer, *client
  };

  const response = await fetch(href, request);
  const body = await response.text();

  const headers: { [name: string]: string } = {};
  if (response.headers.forEach) {
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });
  } else {
    (<() => Array<string>>((<any>(response.headers)).keys))().forEach((key) => {
      headers[key.toLowerCase()] = response.headers.get(key);
    });
  }

  return {
    headers: headers,
    statusCode: response.status,
    statusMessage: response.statusText,
    body: body,
  }
}

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
 * @file wechat-geturl.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */

'use strict';

declare module wx {
  function request(object: Object): any;
}

type GetUrlRequest = {
  url: string,
  method: string,
  header: { [key: string]: string },
  data: any;

  success?: (response: any) => void;
  fail?: (error: any) => void;
};

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

  return new Promise<GetUrlResponse>(async (resolve, reject) => {
    const request: GetUrlRequest = {
      url: href,
      method: (options.method || 'GET'),
      header: (options.headers || {}),
      data: (options.body || undefined),

      success: (response: any) => {
        return resolve({
          headers: response.header,
          statusCode: response.status,
          statusMessage: response.statusText,
          body: response.data,
        });
      },

      fail: (error: any) => {
        return reject(error);
      }
    };
    wx.request(request);
  });
}

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
 * @file eoa.create.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */

'use strict';

import { Request } from './request.dto';
import { Response } from './response.dto';

export type CreateParams = [
  boolean, /* escrow */
];

export type CreateResult = {
  address: string;
  privateKey?: string;
  publicKey: string;
  compressedPublicKey: string;
};

export type CreateRequestDto = Request<'eoa_create', CreateParams>;

export type CreateRsponseDto = Response<CreateResult>;

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
 * @file escrowAccount.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */

'use strict';

import { Request } from './request.dto';
import { Response } from './response.dto';

export type EscrowAccountParams = [
  string, /* privateKey */
];

export type EscrowAccountResult = {};

export type EscrowAccountRequestDto = Request<'escrowAccount', EscrowAccountParams>;

export type EscrowAccountRsponseDto = Response<EscrowAccountResult>;

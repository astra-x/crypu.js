/**
 * @file escrowAccount.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Request } from './request.dto';
import { Response } from './response.dto';
export declare type EscrowAccountParams = [string];
export declare type EscrowAccountResult = {};
export declare type EscrowAccountRequestDto = Request<'escrowAccount', EscrowAccountParams>;
export declare type EscrowAccountRsponseDto = Response<EscrowAccountResult>;

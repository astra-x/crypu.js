/**
 * @file eoa.escrow.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Request } from './request.dto';
import { Response } from './response.dto';
export declare type EscrowParams = [string];
export declare type EscrowResult = {};
export declare type EscrowRequestDto = Request<'eoa_escrow', EscrowParams>;
export declare type EscrowRsponseDto = Response<EscrowResult>;

/**
 * @file get-eoa.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Request } from './request.dto';
import { Response } from './response.dto';
export interface GetEoaResult {
    address: string;
    privateKey?: string;
    publicKey: string;
    compressedPublicKey: string;
}
export declare type GetEoaRequestDto = Request<'getEoa', [string]>;
export declare type GetEoaRsponseDto = Response<GetEoaResult>;

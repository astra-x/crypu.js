/**
 * @file eoa.retrieve.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Request } from './request.dto';
import { Response } from './response.dto';
export declare type RetrieveParams = [string];
export declare type RetrieveResult = {
    address: string;
    privateKey?: string;
    publicKey: string;
    compressedPublicKey: string;
};
export declare type RetrieveRequestDto = Request<'eoa_retrieve', RetrieveParams>;
export declare type RetrieveRsponseDto = Response<RetrieveResult>;

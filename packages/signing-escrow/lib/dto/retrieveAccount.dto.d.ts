/**
 * @file retrieveAccount.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Request } from './request.dto';
import { Response } from './response.dto';
export declare type RetrieveAccountParams = [string];
export declare type RetrieveAccountResult = {
    address: string;
    privateKey?: string;
    publicKey: string;
    compressedPublicKey: string;
};
export declare type RetrieveAccountRequestDto = Request<'retrieveAccount', RetrieveAccountParams>;
export declare type RetrieveAccountRsponseDto = Response<RetrieveAccountResult>;

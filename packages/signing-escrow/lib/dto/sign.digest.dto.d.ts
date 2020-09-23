/**
 * @file sign.digest.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { SignatureLike } from '@ethersproject/bytes';
import { Request } from './request.dto';
import { Response } from './response.dto';
export declare type DigestParams = [string, /* address */ Uint8Array];
export declare type DigestResult = {
    address: string;
    signature: SignatureLike;
};
export declare type DigestRequestDto = Request<'sign_digest', DigestParams>;
export declare type DigestRsponseDto = Response<DigestResult>;

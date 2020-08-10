/**
 * @file sign-digest.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { SignatureLike } from '@ethersproject/bytes';
import { Request } from './request.dto';
import { Response } from './response.dto';
export interface SignDigestResult {
    address: string;
    signature: SignatureLike;
}
export declare type SignDigestRequestDto = Request<'signDigest', [string, Uint8Array]>;
export declare type SignDigestRsponseDto = Response<SignDigestResult>;

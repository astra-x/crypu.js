/**
 * @file createAccount.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Request } from './request.dto';
import { Response } from './response.dto';
export declare type CreateAccountParams = [boolean];
export declare type CreateAccountResult = {
    address: string;
    privateKey?: string;
    publicKey: string;
    compressedPublicKey: string;
};
export declare type CreateAccountRequestDto = Request<'createAccount', CreateAccountParams>;
export declare type CreateAccountRsponseDto = Response<CreateAccountResult>;

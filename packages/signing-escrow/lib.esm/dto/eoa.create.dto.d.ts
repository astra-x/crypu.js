/**
 * @file eoa.create.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Request } from './request.dto';
import { Response } from './response.dto';
export declare type CreateParams = [boolean];
export declare type CreateResult = {
    address: string;
    privateKey?: string;
    publicKey: string;
    compressedPublicKey: string;
};
export declare type CreateRequestDto = Request<'eoa_create', CreateParams>;
export declare type CreateRsponseDto = Response<CreateResult>;

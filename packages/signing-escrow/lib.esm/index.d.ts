/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { BytesLike, Signature } from '@ethersproject/bytes';
import { ConnectionInfo } from '@crypujs/web';
export declare class SigningEscrow {
    _nextId: number;
    readonly connection: ConnectionInfo;
    readonly curve: string;
    readonly address: string;
    readonly privateKey: string;
    readonly publicKey: string;
    readonly compressedPublicKey: string;
    readonly _isSigningEscrow: boolean;
    constructor(connection: ConnectionInfo, address: string);
    signDigest(digest: BytesLike): Promise<Signature>;
    private getResult;
    static isSigningEscrow(value: any): value is SigningEscrow;
}

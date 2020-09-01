/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { BytesLike, SignatureLike } from '@ethersproject/bytes';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
export declare type UnsignedTransaction = {
    nonce?: BigNumberish;
    gasPrice?: BigNumberish;
    gasLimit?: BigNumberish;
    blockLimit?: BigNumberish;
    to?: string;
    value?: BigNumberish;
    data?: BytesLike;
    chainId?: number;
    groupId?: number;
    extraData?: BytesLike;
};
export interface Transaction {
    nonce: BigNumber;
    gasLimit: BigNumber;
    gasPrice: BigNumber;
    blockLimit?: BigNumber;
    from?: string;
    to: string;
    value: BigNumber;
    data: string;
    chainId?: number;
    groupId?: number;
    extraData?: string;
    v?: number;
    r?: string;
    s?: string;
    hash?: string;
}
export declare function computeAddress(key: BytesLike | string): string;
export declare function recoverAddress(digest: BytesLike, signature: SignatureLike): string;
export declare function serializeEthers(transaction: UnsignedTransaction, signature?: SignatureLike): string;
export declare function serializeRc2(transaction: UnsignedTransaction, signature?: SignatureLike): string;
export declare function parse(rawTransaction: BytesLike): Transaction;

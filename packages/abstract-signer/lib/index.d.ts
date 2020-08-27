/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Bytes } from '@ethersproject/bytes';
import { Deferrable } from '@ethersproject/properties';
import { BigNumber } from '@ethersproject/bignumber';
import { BlockTag, Provider, TransactionRequest, TransactionResponse } from '@crypujs/abstract-provider';
export interface ExternallyOwnedAccount {
    readonly address: string;
    readonly privateKey: string;
}
export declare abstract class Signer {
    readonly provider?: Provider;
    abstract getAddress(): Promise<string>;
    abstract signMessage(message: Bytes | string): Promise<string>;
    abstract signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string>;
    abstract connect(provider: Provider): Signer;
    readonly _isSigner: boolean;
    constructor();
    getTransactionCount(blockTag?: BlockTag): Promise<number>;
    call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag): Promise<string>;
    sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse>;
    getChainId(): Promise<number>;
    getGroupId(): Promise<number>;
    getBlockNumber(): Promise<number>;
    getGasPrice(): Promise<BigNumber>;
    estimateGas(tx: Deferrable<TransactionRequest>): Promise<BigNumber>;
    resolveName(name: string): Promise<string>;
    checkTransaction(transaction: Deferrable<TransactionRequest>): Deferrable<TransactionRequest>;
    populateTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionRequest>;
    _checkProvider(operation?: string): void;
    static isSigner(value: any): value is Signer;
}
export declare class VoidSigner extends Signer {
    readonly address: string;
    constructor(address: string, provider?: Provider);
    getAddress(): Promise<string>;
    _fail(message: string, operation: string): Promise<any>;
    signMessage(_: Bytes | string): Promise<string>;
    signTransaction(_: Deferrable<TransactionRequest>): Promise<string>;
    connect(provider: Provider): VoidSigner;
}

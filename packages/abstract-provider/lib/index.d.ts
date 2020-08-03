/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { BytesLike } from '@ethersproject/bytes';
import { Network } from '@ethersproject/networks';
import { Deferrable, Description } from '@ethersproject/properties';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { OnceBlockable } from '@ethersproject/web';
import { Transaction } from '@crypujs/transactions';
export interface ClientVersion {
    'Build Time'?: string;
    'Build Type'?: string;
    'Chain Id': string;
    'FISCO-BCOS Version'?: string;
    'Git Branch'?: string;
    'Git Commit Hash'?: string;
    'Supported Version'?: string;
}
export interface Peer {
    Agency: string;
    IPAndPort: string;
    Node: string;
    NodeID: string;
    Topic: Array<any>;
}
export interface SyncStatus {
    blockNumber: number;
    genesisHash: string;
    isSyncing: boolean;
    knownHighestNumber: number;
    knownLatestHash: string;
    latestHash: string;
    nodeId: string;
    protocolId: number;
    txPoolSize: string;
    peers: Array<{
        blockNumber: number;
        genesisHash: string;
        latestHash: string;
        nodeId: string;
    }>;
}
export declare type TransactionRequest = {
    nonce?: BigNumberish;
    gasPrice?: BigNumberish;
    gasLimit?: BigNumberish;
    blockLimit?: BigNumberish;
    from?: string;
    to?: string;
    value?: BigNumberish;
    data?: BytesLike;
    chainId?: number;
    groupId?: number;
    extraData?: BytesLike;
};
export interface TransactionResponse extends Transaction {
    hash: string;
    blockNumber?: number;
    blockHash?: string | null;
    transactionIndex?: number;
    timestamp?: number;
    confirmations: number;
    from: string;
    raw?: string;
    wait: (confirmations?: number) => Promise<TransactionReceipt>;
}
export declare type BlockTag = string | number;
interface _Block {
    extraData: Array<any>;
    gasLimit: BigNumber;
    gasUsed: BigNumber;
    hash: string;
    parentHash: string;
    number: number;
    timestamp: number;
    sealer: string;
    sealerList: Array<string>;
    stateRoot: string;
    transactionsRoot: string;
    receiptsRoot: string;
}
export interface Block extends _Block {
    transactions: Array<string>;
}
export interface BlockWithTransactions extends _Block {
    transactions: Array<TransactionResponse>;
}
export interface Log {
    blockNumber?: number;
    blockHash?: string;
    transactionIndex?: number;
    removed?: boolean;
    address: string;
    data: string;
    topics: Array<string>;
    transactionHash?: string;
    logIndex?: number;
}
export interface TransactionReceipt {
    to: string;
    from: string;
    contractAddress: string;
    input: string;
    output: string;
    root?: string;
    gasUsed: BigNumber;
    logsBloom: string;
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    logs: Array<Log>;
    confirmations: number;
    status?: number;
}
export interface EventFilter {
    address?: string;
    topics?: Array<string | Array<string>>;
}
export interface Filter extends EventFilter {
    fromBlock?: BlockTag;
    toBlock?: BlockTag;
}
export interface FilterByBlockHash extends EventFilter {
    blockHash?: string;
}
export declare abstract class ForkEvent extends Description {
    readonly expiry: number;
    readonly _isForkEvent?: boolean;
    static isForkEvent(value: any): value is ForkEvent;
}
export declare class BlockForkEvent extends ForkEvent {
    readonly blockHash: string;
    readonly _isBlockForkEvent?: boolean;
    constructor(blockHash: string, expiry?: number);
}
export declare class TransactionForkEvent extends ForkEvent {
    readonly hash: string;
    readonly _isTransactionOrderForkEvent?: boolean;
    constructor(hash: string, expiry?: number);
}
export declare class TransactionOrderForkEvent extends ForkEvent {
    readonly beforeHash: string;
    readonly afterHash: string;
    constructor(beforeHash: string, afterHash: string, expiry?: number);
}
export declare type EventType = string | Array<string | Array<string>> | EventFilter | ForkEvent;
export declare type Listener = (...args: Array<any>) => void;
export declare abstract class Provider implements OnceBlockable {
    abstract getNetwork(): Promise<Network>;
    abstract getGroupId(): Promise<number>;
    abstract getBlockNumber(): Promise<number>;
    abstract getGasPrice(): Promise<BigNumber>;
    abstract getTransactionCount(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number>;
    abstract getCode(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>;
    abstract sendTransaction(signedTransaction: string | Promise<string>): Promise<TransactionResponse>;
    abstract call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>;
    abstract estimateGas(transaction?: Deferrable<TransactionRequest>): Promise<BigNumber>;
    abstract getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block>;
    abstract getBlockWithTransactions(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<BlockWithTransactions>;
    abstract getTransaction(transactionHash: string): Promise<TransactionResponse>;
    abstract getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>;
    abstract getLogs(filter: Filter): Promise<Array<Log>>;
    abstract resolveName(name: string | Promise<string>): Promise<string>;
    abstract lookupAddress(address: string | Promise<string>): Promise<string>;
    abstract on(eventName: EventType, listener: Listener): Provider;
    abstract once(eventName: EventType, listener: Listener): Provider;
    abstract emit(eventName: EventType, ...args: Array<any>): boolean;
    abstract listenerCount(eventName?: EventType): number;
    abstract listeners(eventName?: EventType): Array<Listener>;
    abstract off(eventName: EventType, listener?: Listener): Provider;
    abstract removeAllListeners(eventName?: EventType): Provider;
    addListener(eventName: EventType, listener: Listener): Provider;
    removeListener(eventName: EventType, listener: Listener): Provider;
    abstract waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt>;
    readonly _isProvider: boolean;
    constructor();
    static isProvider(value: any): value is Provider;
}
export {};

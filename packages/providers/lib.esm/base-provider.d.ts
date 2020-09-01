/**
 * @file base-provider.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
/// <reference types="node" />
import { SignatureLike } from '@ethersproject/bytes';
import { Network, Networkish } from '@ethersproject/networks';
import { Deferrable } from '@ethersproject/properties';
import { BigNumber } from '@ethersproject/bignumber';
import { UnsignedTransaction, Transaction } from '@crypujs/transactions';
import { ClientVersion, SyncStatus, Peer, Block, BlockTag, BlockWithTransactions, TransactionReceipt, TransactionRequest, TransactionResponse, EventType, Filter, FilterByBlockHash, Listener, Log, Provider } from '@crypujs/abstract-provider';
import { Chain } from './constants';
import { Formatter } from './formatter';
export declare class Event {
    readonly listener: Listener;
    readonly once: boolean;
    readonly tag: string;
    constructor(tag: string, listener: Listener, once: boolean);
    get event(): EventType;
    get type(): string;
    get hash(): string;
    get filter(): Filter;
    pollable(): boolean;
}
export declare class BaseProvider extends Provider {
    formatter: Formatter;
    _emitted: {
        [eventName: string]: number | 'pending';
    };
    _events: Array<Event>;
    _pollingInterval: number;
    _poller: NodeJS.Timer;
    _bootstrapPoll: NodeJS.Timer;
    _lastBlockNumber: number;
    _fastBlockNumber: number;
    _fastBlockNumberPromise: Promise<number>;
    _fastQueryDate: number;
    _maxInternalBlockNumber: number;
    _internalBlockNumber: Promise<{
        blockNumber: number;
        reqTime: number;
        respTime: number;
    }>;
    readonly anyNetwork: boolean;
    _networkPromise: Promise<Network>;
    _network: Network;
    _groupId: number;
    readonly serializeTransaction: (transaction: UnsignedTransaction) => string;
    readonly populateTransaction: (transaction: Deferrable<TransactionRequest>) => Promise<TransactionRequest>;
    readonly getChainId: () => Promise<number>;
    /**
     *  ready
     *
     *  A Promise<Network> that resolves only once the provider is ready.
     *
     *  Sub-classes that call the super with a network without a chainId
     *  MUST set this. Standard named networks have a known chainId.
     *
     */
    constructor(chain: Chain, network: Networkish | Promise<Network>, groupId: number);
    _ready(): Promise<Network>;
    get ready(): Promise<Network>;
    static getFormatter(): Formatter;
    static serializeTransaction(chain: Chain): (transaction: TransactionRequest, signature?: SignatureLike) => string;
    static populateTransaction(chain: Chain, self: Provider): (transaction: Deferrable<TransactionRequest>) => Promise<TransactionRequest>;
    static getNetwork(network: Networkish): Network;
    static getChainId(chain: Chain, perform: (method: string, params: any) => Promise<any>): () => Promise<number>;
    _getInternalBlockNumber(maxAge: number): Promise<number>;
    poll(): Promise<void>;
    resetEventsBlock(blockNumber: number): void;
    get network(): Network;
    get groupId(): number;
    detectNetwork(): Promise<Network>;
    getNetwork(): Promise<Network>;
    getGroupId(): Promise<number>;
    get blockNumber(): number;
    get polling(): boolean;
    set polling(value: boolean);
    get pollingInterval(): number;
    set pollingInterval(value: number);
    _getFastBlockNumber(): Promise<number>;
    _setFastBlockNumber(blockNumber: number): void;
    waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt>;
    getBlockNumber(): Promise<number>;
    getGasPrice(): Promise<BigNumber>;
    getClientVersion(): Promise<ClientVersion>;
    getPbftView(): Promise<number>;
    getSealerList(): Promise<Array<string>>;
    getObserverList(): Promise<Array<string>>;
    getSyncStatus(): Promise<SyncStatus>;
    getPeers(): Promise<Peer>;
    getNodeIdList(): Promise<Array<string>>;
    getGroupList(): Promise<Array<number>>;
    getBalance(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber>;
    getTransactionCount(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number>;
    getCode(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>;
    _wrapTransaction(tx: Transaction, hash?: string): TransactionResponse;
    sendTransaction(signedTransaction: string | Promise<string>, hook?: (transaction: TransactionResponse) => Promise<any>): Promise<TransactionResponse>;
    _getTransactionRequest(transaction: Deferrable<TransactionRequest>): Promise<Transaction>;
    _getFilter(filter: Filter | FilterByBlockHash | Promise<Filter | FilterByBlockHash>): Promise<Filter | FilterByBlockHash>;
    call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>;
    estimateGas(transaction: Deferrable<TransactionRequest>): Promise<BigNumber>;
    _getAddress(addressOrName: string | Promise<string>): Promise<string>;
    _getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>, includeTransactions?: boolean): Promise<Block | BlockWithTransactions>;
    getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block>;
    getBlockWithTransactions(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<BlockWithTransactions>;
    getTransaction(transactionHash: string | Promise<string>): Promise<TransactionResponse>;
    getTransactionReceipt(transactionHash: string | Promise<string>): Promise<TransactionReceipt>;
    getLogs(filter: Filter | FilterByBlockHash | Promise<Filter | FilterByBlockHash>): Promise<Array<Log>>;
    getEtherPrice(): Promise<number>;
    _getBlockTag(blockTag: BlockTag | Promise<BlockTag>): Promise<BlockTag>;
    _getResolver(name: string): Promise<string>;
    resolveName(name: string | Promise<string>): Promise<string>;
    lookupAddress(address: string | Promise<string>): Promise<string>;
    perform(method: string, params: any): Promise<any>;
    _startEvent(event: Event): void;
    _stopEvent(event: Event): void;
    _addEventListener(eventName: EventType, listener: Listener, once: boolean): this;
    on(eventName: EventType, listener: Listener): this;
    once(eventName: EventType, listener: Listener): this;
    emit(eventName: EventType, ...args: Array<any>): boolean;
    listenerCount(eventName?: EventType): number;
    listeners(eventName?: EventType): Array<Listener>;
    off(eventName: EventType, listener?: Listener): this;
    removeAllListeners(eventName?: EventType): this;
}

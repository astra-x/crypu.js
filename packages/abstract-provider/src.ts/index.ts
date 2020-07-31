/*
 This file is part of crypu.js.

 crypu.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 crypu.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with crypu.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */

'use strict';

import { Logger } from '@ethersproject/logger';
import {
  BytesLike,
  isHexString,
} from '@ethersproject/bytes';
import { Network } from '@ethersproject/networks';
import {
  Deferrable,
  Description,
  defineReadOnly,
} from '@ethersproject/properties';
import {
  BigNumber,
  BigNumberish,
} from '@ethersproject/bignumber';
import { OnceBlockable } from '@ethersproject/web';

import { Transaction } from '@crypujs/transactions';

const logger = new Logger('abstract-provider');

///////////////////////////////
// Exported Types

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

export type TransactionRequest = {
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
}

export interface TransactionResponse extends Transaction {
  hash: string;

  // Only if a transaction has been mined
  blockNumber?: number,
  blockHash?: string | null,
  timestamp?: number,

  confirmations: number,

  // Not optional (as it is in Transaction)
  from: string;

  // The raw transaction
  raw?: string,

  // This function waits until the transaction has been mined
  wait: (confirmations?: number) => Promise<TransactionReceipt>
};

export type BlockTag = string | number;

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
};

export interface EventFilter {
  address?: string;
  topics?: Array<string | Array<string>>;
}

export interface Filter extends EventFilter {
  fromBlock?: BlockTag,
  toBlock?: BlockTag,
}

export interface FilterByBlockHash extends EventFilter {
  blockHash?: string;
}

//export type CallTransactionable = {
//    call(transaction: TransactionRequest): Promise<TransactionResponse>;
//};

export abstract class ForkEvent extends Description {
  readonly expiry: number;

  readonly _isForkEvent?: boolean;

  static isForkEvent(value: any): value is ForkEvent {
    return !!(value && value._isForkEvent);
  }
}

export class BlockForkEvent extends ForkEvent {
  readonly blockHash: string;

  readonly _isBlockForkEvent?: boolean;

  constructor(blockHash: string, expiry?: number) {
    if (!isHexString(blockHash, 32)) {
      logger.throwArgumentError('invalid blockHash', 'blockHash', blockHash);
    }

    super({
      _isForkEvent: true,
      _isBlockForkEvent: true,
      expiry: (expiry || 0),
      blockHash: blockHash
    });
  }
}

export class TransactionForkEvent extends ForkEvent {
  readonly hash: string;

  readonly _isTransactionOrderForkEvent?: boolean;

  constructor(hash: string, expiry?: number) {
    if (!isHexString(hash, 32)) {
      logger.throwArgumentError('invalid transaction hash', 'hash', hash);
    }

    super({
      _isForkEvent: true,
      _isTransactionForkEvent: true,
      expiry: (expiry || 0),
      hash: hash
    });
  }
}

export class TransactionOrderForkEvent extends ForkEvent {
  readonly beforeHash: string;
  readonly afterHash: string;

  constructor(beforeHash: string, afterHash: string, expiry?: number) {
    if (!isHexString(beforeHash, 32)) {
      logger.throwArgumentError('invalid transaction hash', 'beforeHash', beforeHash);
    }
    if (!isHexString(afterHash, 32)) {
      logger.throwArgumentError('invalid transaction hash', 'afterHash', afterHash);
    }

    super({
      _isForkEvent: true,
      _isTransactionOrderForkEvent: true,
      expiry: (expiry || 0),
      beforeHash: beforeHash,
      afterHash: afterHash
    });
  }
}

export type EventType = string | Array<string | Array<string>> | EventFilter | ForkEvent;

export type Listener = (...args: Array<any>) => void;

///////////////////////////////
// Exported Abstracts

export abstract class Provider implements OnceBlockable {

  // Network
  abstract getNetwork(): Promise<Network>;
  abstract getGroupId(): Promise<number>;

  // Latest State
  abstract getBlockNumber(): Promise<number>;
  abstract getGasPrice(): Promise<BigNumber>;

  // Account
  abstract getTransactionCount(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number>;
  abstract getCode(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>;

  // Execution
  abstract sendTransaction(signedTransaction: string | Promise<string>): Promise<TransactionResponse>;
  abstract call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>;
  abstract estimateGas(transaction?: Deferrable<TransactionRequest>): Promise<BigNumber>;

  // Queries
  abstract getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block>;
  abstract getBlockWithTransactions(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<BlockWithTransactions>;
  abstract getTransaction(transactionHash: string): Promise<TransactionResponse>;
  abstract getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>;

  // Bloom-filter Queries
  abstract getLogs(filter: Filter): Promise<Array<Log>>;

  // ENS
  abstract resolveName(name: string | Promise<string>): Promise<string>;
  abstract lookupAddress(address: string | Promise<string>): Promise<string>;

  // Event Emitter (ish)
  abstract on(eventName: EventType, listener: Listener): Provider;
  abstract once(eventName: EventType, listener: Listener): Provider;
  abstract emit(eventName: EventType, ...args: Array<any>): boolean
  abstract listenerCount(eventName?: EventType): number;
  abstract listeners(eventName?: EventType): Array<Listener>;
  abstract off(eventName: EventType, listener?: Listener): Provider;
  abstract removeAllListeners(eventName?: EventType): Provider;

  // Alias for 'on'
  addListener(eventName: EventType, listener: Listener): Provider {
    return this.on(eventName, listener);
  }

  // Alias for 'off'
  removeListener(eventName: EventType, listener: Listener): Provider {
    return this.off(eventName, listener);
  }

  // @TODO: This *could* be implemented here, but would pull in events...
  abstract waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt>;

  readonly _isProvider: boolean;

  constructor() {
    logger.checkAbstract(new.target, Provider);
    defineReadOnly(this, '_isProvider', true);
  }

  static isProvider(value: any): value is Provider {
    return !!(value && value._isProvider);
  }
}

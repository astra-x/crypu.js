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

// class Interface
// constructor(fragments: string | Array<Fragment | JsonFragment | string>)
// getFunction(nameOrSignatureOrSighash: string): FunctionFragment
// getEvent(nameOrSignatureOrTopic: string): EventFragment
// getSighash(functionFragment: FunctionFragment | string): string
// getEventTopic(eventFragment: EventFragment | string): string
// encodeFunctionData(functionFragment: FunctionFragment | string, values?: Array<any>): string
// decodeFunctionData(functionFragment: FunctionFragment | string, data: BytesLike): Result
// encodeEventLog(eventFragment: EventFragment, values: Array<any>): { data: string, topics: Array<string> }
// decodeEventLog(eventFragment: EventFragment | string, data: BytesLike, topics?: Array<string>): Result

// class JsonRpcProvider
// constructor(url?: string, network?: Network | Promise<Network>, groupId?: number)
// async getBlockNumber(): Promise<number>
// async getGasPrice(): Promise<BigNumber>
// async getClientVersion(): Promise<ClientVersion>
// async getPbftView(): Promise<number>
// async getSealerList(): Promise<Array<string>>
// async getObserverList(): Promise<Array<string>>
// async getSyncStatus(): Promise<SyncStatus>
// async getPeers(): Promise<Peer>
// async getNodeIdList(): Promise<Array<string>>
// async getGroupList(): Promise<Array<number>>
// async sendTransaction(signedTransaction: string | Promise<string>): Promise<TransactionResponse>
// async getTransaction(transactionHash: string | Promise<string>): Promise<TransactionResponse>
// async getTransactionReceipt(transactionHash: string | Promise<string>): Promise<TransactionReceipt>
// async getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block>
// async getBlockWithTransactions(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<BlockWithTransactions>
// async estimateGas(_?: Deferrable<TransactionRequest>): Promise<BigNumber>

// class Wallet
// constructor(privateKey: BytesLike | ExternallyOwnedAccount | SigningKey, provider?: Provider)
// connect(provider: Provider): Wallet
// get mnemonic()
// get privateKey()
// get publicKey()
// async getAddress()
// async signTransaction(transaction: TransactionRequest): Promise<string>
// async sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse>
// async getChainId(): Promise<number>
// async getGroupId(): Promise<number>
// async getBlockNumber(): Promise<number>
// async getGasPrice(): Promise<BigNumber>

export {
  BytesLike,
} from '@ethersproject/bytes';

export {
  Deferrable,
} from '@ethersproject/properties';

export {
  Network,
} from '@ethersproject/networks';

export {
  SigningKey,
} from '@ethersproject/signing-key';

export {
  JsonFragment,
  Fragment,
  FunctionFragment,
  EventFragment,
  Result,
  Interface,
} from '@crypujs/abi';

export {
  ClientVersion,
  SyncStatus,
  Peer,
  TransactionRequest,
  TransactionResponse,
  TransactionReceipt,
  BlockTag,
  Block,
  BlockWithTransactions,
  Provider,
} from '@crypujs/abstract-provider';

export {
  ExternallyOwnedAccount,
} from '@crypujs/abstract-signer';

export {
  JsonRpcProvider,
} from '@crypujs/providers';

export {
  Wallet,
} from '@crypujs/wallet';

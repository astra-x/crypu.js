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
 * @file fisco.test.ts
 * @author Abnernat <zhang951005@gmail.com>
 * @date 2020
 */

'use strict';

import { BigNumber } from "@ethersproject/bignumber";

import { JsonFragmentType } from "@crypujs/abi";
import {
  Network,
  JsonFragment,
  Interface,
  ClientVersion,
  SyncStatus,
  Peer,
  TransactionRequest,
  TransactionResponse,
  TransactionReceipt,
  BlockTag,
  Block,
  BlockWithTransactions,
  Wallet,
  JsonRpcProvider,
} from "@crypujs/fisco";

const bnify = BigNumber.from;

// Interfaces
interface ProviderConfig {
  url: string;
  network: Network;
  groupId: number;
}

interface Example {
  clientVersion: ClientVersion;
  pbftView: string;
  sealerList: Array<string>;
  observerList: string[];
  syncStatus: SyncStatus;
  peers: Array<Peer>;
  nodeIdList: Array<string>;
  groupList: Array<number>;
  blockTag: BlockTag;
  blockByTag: any;
  blockHash: string;
  blockByAddress: Block | any;
  blockWithTransactions: BlockWithTransactions | any;
  testTransaction: TransactionRequest;
  testTransactionAddr: string;
  walletSendTransactionResult: TransactionResponse | any;
  providerSendTransactionResult: TransactionResponse | any;
  getTransactionReceiptResult: TransactionReceipt | any;
  getTransactionResult: TransactionResponse | any;
  getChainIdResult: number;
  getGroupIdResult: number;
  populateTransactionResult: TransactionRequest | any;
  signTransactionResult: string;
  serializeResult: string;
  estimateGasResult: BigNumber | any;
  mnemWalletAddr: string;
  walletMnemPrivKey: string;
  walletPubkey: string;
  privKeyWalletAddr: string;
  walletMnemPhrase: string;
  walletPrivKey: string;
  abiTestData: any;
  walletCallData: TransactionRequest | any;
  walletCallResult: string;
}

interface TestData {
  providerConfig: ProviderConfig;
  abi: Interface;
  examples: Array<Example>;
}

// Test Abi
const erc721Abi = <Array<JsonFragment>>[
  {
    inputs: [
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    inputs: [
      <JsonFragmentType>{
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      <JsonFragmentType>{
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const roleControllerAbi = <Array<JsonFragment>>[
  {
    constant: true,
    inputs: [],
    name: "MODIFY_ADMIN",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "RETURN_CODE_FAILURE_NO_PERMISSION",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "addr",
        type: "address",
      },
      {
        name: "role",
        type: "uint256",
      },
    ],
    name: "checkRole",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "ROLE_COMMITTEE",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "addr",
        type: "address",
      },
      {
        name: "role",
        type: "uint256",
      },
    ],
    name: "removeRole",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "MODIFY_KEY_CPT",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "addr",
        type: "address",
      },
      {
        name: "role",
        type: "uint256",
      },
    ],
    name: "addRole",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "addr",
        type: "address",
      },
      {
        name: "operation",
        type: "uint256",
      },
    ],
    name: "checkPermission",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "MODIFY_AUTHORITY_ISSUER",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "MODIFY_COMMITTEE",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "ROLE_ADMIN",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "ROLE_AUTHORITY_ISSUER",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
];

// Test Data
const testData: Array<TestData> = [
  {
    providerConfig: {
      url: "http://47.56.165.246:8545",
      network: {
        name: "fisco-bcos",
        chainId: 1,
      },
      groupId: 1,
    },
    abi: new Interface(erc721Abi),
    examples: [
      {
        walletCallData: {
          from: "0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6",
          to: "0x2f7bbf70d7052b4b33e3f7e0347efce131801e64",
          data: new Interface(
            roleControllerAbi
          ).encodeFunctionData("checkPermission(address,uint)", [
            "0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6",
            201,
          ]),
        },
        testTransactionAddr:
          "0xdf06b656004645b727c628a3a574abd0c4f56be8d2b328eac56eef5bcbaf1f95",
        mnemWalletAddr: "0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6",
        privKeyWalletAddr: "0xc674ce8E3535455F0CA6643A248F53f97A923061",
        clientVersion: {
          "Build Time": "20200619 06:32:10",
          "Build Type": "Linux/clang/Release",
          "Chain Id": "1",
          "FISCO-BCOS Version": "2.5.0",
          "Git Branch": "HEAD",
          "Git Commit Hash": "72c6d770e5cf0f4197162d0e26005ec03d30fcfe",
          "Supported Version": "2.5.0",
        },
        pbftView: "0xc588",
        sealerList: [
          "12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e",
          "3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a",
          "8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0",
          "f3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8",
        ],
        observerList: [],
        syncStatus: {
          blockNumber: 28536,
          genesisHash:
            "e20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0",
          isSyncing: false,
          knownHighestNumber: 28536,
          knownLatestHash:
            "b7b64f7935f8343ad724eeedc97fc6460c375f68767eb9c9a406aa91f770d2cd",
          latestHash:
            "b7b64f7935f8343ad724eeedc97fc6460c375f68767eb9c9a406aa91f770d2cd",
          nodeId:
            "f3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8",
          peers: [
            {
              blockNumber: 28536,
              genesisHash:
                "e20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0",
              latestHash:
                "b7b64f7935f8343ad724eeedc97fc6460c375f68767eb9c9a406aa91f770d2cd",
              nodeId:
                "12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e",
            },
            {
              blockNumber: 28536,
              genesisHash:
                "e20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0",
              latestHash:
                "b7b64f7935f8343ad724eeedc97fc6460c375f68767eb9c9a406aa91f770d2cd",
              nodeId:
                "3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a",
            },
            {
              blockNumber: 28536,
              genesisHash:
                "e20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0",
              latestHash:
                "b7b64f7935f8343ad724eeedc97fc6460c375f68767eb9c9a406aa91f770d2cd",
              nodeId:
                "8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0",
            },
          ],
          protocolId: 65545,
          txPoolSize: "0",
        },
        peers: [
          {
            Agency: "agency-a",
            IPAndPort: "127.0.0.1:30301",
            Node: "node_127.0.0.1_30301",
            NodeID:
              "12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e",
            Topic: [],
          },
          {
            Agency: "agency-b",
            IPAndPort: "127.0.0.1:30302",
            Node: "node_127.0.0.1_30302",
            NodeID:
              "3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a",
            Topic: [],
          },
          {
            Agency: "agency-b",
            IPAndPort: "127.0.0.1:30303",
            Node: "node_127.0.0.1_30303",
            NodeID:
              "8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0",
            Topic: [],
          },
        ],
        nodeIdList: [
          "f3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8",
          "12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e",
          "3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a",
          "8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0",
        ],
        groupList: [1],
        blockTag: 0x1,
        blockByTag: {
          extraData: [],
          gasLimit: { _hex: "0x00", _isBigNumber: true },
          gasUsed: { _hex: "0x00", _isBigNumber: true },
          hash:
            "0x3bc32897ea43e6667ffb0409990dbdea218525d754bcee354ce45c8b97a24df7",
          parentHash:
            "0xe20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0",
          number: 1,
          timestamp: 1593594576348,
          sealer: "0x1",
          sealerList: [
            "0x12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e",
            "0x3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a",
            "0x8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0",
            "0xf3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8",
          ],
          transactions: [
            "0x2ed687722049a4fb94f1ce34714f5b20003bd2cf089530203754ca83458fb4a3",
          ],
          stateRoot:
            "0x4c73e4c0827a23e5ad4a0c8d7c9be31a7e0db6f3cbd29857dfb7c86734aab723",
          transactionsRoot:
            "0x615b947f3ed7ee1d92c242bf727a5ee76b0fe1537d9d39066c02b203dddeeb35",
          receiptsRoot:
            "0x972d23e051bcd1a345b0d7872d30e09b798e7702e684e62dd0ca2404c55e930a",
        },
        blockHash:
          "0x3bc32897ea43e6667ffb0409990dbdea218525d754bcee354ce45c8b97a24df7",
        blockByAddress: {
          extraData: [],
          gasLimit: { _hex: "0x00", _isBigNumber: true },
          gasUsed: { _hex: "0x00", _isBigNumber: true },
          hash:
            "0x3bc32897ea43e6667ffb0409990dbdea218525d754bcee354ce45c8b97a24df7",
          parentHash:
            "0xe20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0",
          number: 1,
          timestamp: 1593594576348,
          sealer: "0x1",
          sealerList: [
            "0x12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e",
            "0x3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a",
            "0x8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0",
            "0xf3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8",
          ],
          transactions: [
            "0x2ed687722049a4fb94f1ce34714f5b20003bd2cf089530203754ca83458fb4a3",
          ],
          stateRoot:
            "0x4c73e4c0827a23e5ad4a0c8d7c9be31a7e0db6f3cbd29857dfb7c86734aab723",
          transactionsRoot:
            "0x615b947f3ed7ee1d92c242bf727a5ee76b0fe1537d9d39066c02b203dddeeb35",
          receiptsRoot:
            "0x972d23e051bcd1a345b0d7872d30e09b798e7702e684e62dd0ca2404c55e930a",
        },
        blockWithTransactions: {
          extraData: [],
          gasLimit: bnify(0x00),
          gasUsed: bnify(0x00),
          hash:
            "0x3bc32897ea43e6667ffb0409990dbdea218525d754bcee354ce45c8b97a24df7",
          parentHash:
            "0xe20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0",
          number: 1,
          timestamp: 1593594576348,
          sealer: "0x1",
          sealerList: [
            "0x12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e",
            "0x3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a",
            "0x8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0",
            "0xf3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8",
          ],
          transactions: [
            {
              hash:
                "0x2ed687722049a4fb94f1ce34714f5b20003bd2cf089530203754ca83458fb4a3",
              blockHash:
                "0x3bc32897ea43e6667ffb0409990dbdea218525d754bcee354ce45c8b97a24df7",
              blockNumber: 1,
              transactionIndex: 0,
              from: "0xc674ce8E3535455F0CA6643A248F53f97A923061",
              gasPrice: bnify(0x01),
              gasLimit: bnify(0x05f5e100),
              to: null,
              value: bnify(0x00),
              data:
                "0x608060405234801561001057600080fd5b506040805190810160405280600d81526020017f48656c6c6f2c20576f726c6421000000000000000000000000000000000000008152506000908051906020019061005c929190610062565b50610107565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100a357805160ff19168380011785556100d1565b828001600101855582156100d1579182015b828111156100d05782518255916020019190600101906100b5565b5b5090506100de91906100e2565b5090565b61010491905b808211156101005760008160009055506001016100e8565b5090565b90565b6102d7806101166000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063299f7f9d146100515780633590b49f146100e1575b600080fd5b34801561005d57600080fd5b5061006661014a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100a657808201518184015260208101905061008b565b50505050905090810190601f1680156100d35780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156100ed57600080fd5b50610148600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506101ec565b005b606060008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156101e25780601f106101b7576101008083540402835291602001916101e2565b820191906000526020600020905b8154815290600101906020018083116101c557829003601f168201915b5050505050905090565b8060009080519060200190610202929190610206565b5050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061024757805160ff1916838001178555610275565b82800160010185558215610275579182015b82811115610274578251825591602001919060010190610259565b5b5090506102829190610286565b5090565b6102a891905b808211156102a457600081600090555060010161028c565b5090565b905600a165627a7a7230582034688ac8350127435a19e92899a5416c4de4ec226511ea42975eb0e5a062bfdf0029",
              creates: "0x2921E14581eb0AFeAbf061648e5C4DfFf309c0b3",
              chainId: 0,
            },
          ],
          stateRoot:
            "0x4c73e4c0827a23e5ad4a0c8d7c9be31a7e0db6f3cbd29857dfb7c86734aab723",
          transactionsRoot:
            "0x615b947f3ed7ee1d92c242bf727a5ee76b0fe1537d9d39066c02b203dddeeb35",
          receiptsRoot:
            "0x972d23e051bcd1a345b0d7872d30e09b798e7702e684e62dd0ca2404c55e930a",
        },
        testTransaction: {
          data:
            "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
          to: "0x3a1c406f0af920f9371d3b75b8f8c1a14264fd37",
        },
        walletSendTransactionResult: {
          nonce: {
            _hex: "0x6ea7b57109ec897f37d7492b34747245",
            _isBigNumber: true,
          },
          gasPrice: bnify(0x11e1a300),
          gasLimit: bnify(0x0f4240),
          blockLimit: bnify(0x6fdc),
          to: "0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37",
          value: bnify(0x00),
          data:
            "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
          chainId: 1,
          groupId: 1,
          extraData: "0x",
          v: 27,
          r:
            "0x3d348b651c147f99e9e79c38fac8d55671de5fd150fe55c4e4fec63ae53c9a0f",
          s:
            "0x364f8d902a247a9f6ee6de8d33318673372ea860b066c40ab702b548418313a3",
          from: "0xc674ce8E3535455F0CA6643A248F53f97A923061",
          hash:
            "0xff0e19e29aa94efc32044f9f0b2c783bfe2f9dccb82b303d2883773d6487ba9f",
        },
        providerSendTransactionResult: {
          nonce: bnify(0x00),
          gasPrice: bnify(0x00),
          gasLimit: bnify(0x00),
          blockLimit: bnify(0x00),
          to: "0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37",
          value: bnify(0x00),
          data:
            "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
          chainId: 0,
          groupId: 0,
          extraData: "0x",
          v: 28,
          r:
            "0xe240d7e1f1cea773a54e32a81a6a8e4ae80c462a71c6aa0b089156566a2c0818",
          s:
            "0x1b97c22b8a946d7e3f0ed36c9f04534d3ca0d23230a8872af10b75e7ffa639f3",
          from: "0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6",
          hash:
            "0xb98d7bb7bfb21b4966b70a43d4e0d57ad04302bb1acaee39d0a7b3db501a0c7f",
        },
        getChainIdResult: 1,
        getGroupIdResult: 1,
        getTransactionReceiptResult: {
          to: "0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37",
          from: "0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6",
          contractAddress: "0x0000000000000000000000000000000000000000",
          input:
            "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
          output:
            "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000023331000000000000000000000000000000000000000000000000000000000000",
          root:
            "0x97f48fae00dc51f5e16502414db04d31cda99cef65cf42f133bf2f2133593b24",
          gasUsed: bnify(0xd059),
          logsBloom:
            "0x00000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000004080000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000001000000000000000000001000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000100000000000000",
          blockHash:
            "0xe2daf45a1b6af33743c6d2a392a880db7a782e36e45b331c708753ee74a3ddda",
          blockNumber: 28304,
          transactionHash:
            "0xdf06b656004645b727c628a3a574abd0c4f56be8d2b328eac56eef5bcbaf1f95",
          transactionIndex: 0,
          logs: [
            {
              address: "0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37",
              data: "0x",
              topics: [
                "0xc70d9e3cda68d24f5c9a96a00e240c9765756eeeb308ed7da2ba63cfe23d1f2a",
                "0x000000000000000000000000000000000000000000000000000000000000001f",
              ],
            },
          ],
          confirmations: 174,
          status: 0,
        },
        getTransactionResult: {
          hash:
            "0xdf06b656004645b727c628a3a574abd0c4f56be8d2b328eac56eef5bcbaf1f95",
          blockHash:
            "0xe2daf45a1b6af33743c6d2a392a880db7a782e36e45b331c708753ee74a3ddda",
          blockNumber: 28304,
          transactionIndex: 0,
          confirmations: 233,
          from: "0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6",
          gasPrice: bnify(0x11e1a300),
          gasLimit: bnify(0x0f4240),
          to: "0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37",
          value: bnify(0x00),
          nonce: {
            _hex: "0x4cfeb89292ea62c2712a2dcafd2ba2c7",
            _isBigNumber: true,
          },
          data:
            "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
          creates: null,
          chainId: 0,
        },
        populateTransactionResult: {
          data:
            "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
          to: "0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37",
          from: "0xc674ce8E3535455F0CA6643A248F53f97A923061",
          nonce: "0xb819f5906213b8c355b3ad9079e91ee2",
          blockLimit: 28636,
          chainId: 1,
          groupId: 1,
          gasPrice: bnify(0x11e1a300),
          gasLimit: bnify(0x0f4240),
        },
        estimateGasResult: { _hex: "0x0f4240", _isBigNumber: true },
        serializeResult:
          "0xf8bc90b819f5906213b8c355b3ad9079e91ee28411e1a300830f4240826fdc943a1c406f0af920f9371d3b75b8f8c1a14264fd3780b884643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000010180",
        signTransactionResult:
          "0xf8e680808080943a1c406f0af920f9371d3b75b8f8c1a14264fd3780b8846437197700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000361626300000000000000000000000000000000000000000000000000000000008080801ca0e240d7e1f1cea773a54e32a81a6a8e4ae80c462a71c6aa0b089156566a2c0818a01b97c22b8a946d7e3f0ed36c9f04534d3ca0d23230a8872af10b75e7ffa639f3",
        walletCallResult:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        walletMnemPhrase:
          "ribbon glimpse rescue nuclear elevator album rookie imitate fuel resemble banner arrow",
        walletMnemPrivKey:
          "0xd0261992c686061d8597a69ef24374c9ce88dbdab163285c5afb288f2a701194",
        walletPrivKey:
          "0x1925b8bee81b6189e0a3aa0e6ce99e7c3deaf8bdf8767ee388ff15e78eae863e",
        walletPubkey:
          "0x04646147a574bdaadb6157ff59260cd9ffd346dfdfd4dfbc3bb6495495f67b06385d05485072d4c5cc5e1c49e46557cef5811e0c255e48fb20c8d181cce4222bd2",
        abiTestData: {
          function: {
            functionFragmentSig: "transfer(address,uint256)",
            functionFragmentSighash: "0xa9059cbb",
            decodeData:
              "0xa9059cbb0000000000000000000000008b4ab4667ad81af60e914a33f3aee35865825df60000000000000000000000000000000000000000000000056bc75e2d63100000",
            encodeData: [
              "0x8b4ab4667ad81af60e914a33f3aee35865825df6",
              "100000000000000000000",
            ],
          },
          event: {
            eventFragmentSig: "Transfer(address,address,uint256)",
            eventFragmentTopic:
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            decodeData:
              "0x00000000000000000000000000000000000000000000000ad78ebc5ac6200000",
            decodeTopic: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x00000000000000000000000057fbf0e343b2f42297b6b52526d5c2e88589a052",
              "0x0000000000000000000000008af5324a124a06f0348cb624fa0de9198a2da0cb",
            ],
            parseTopic: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x00000000000000000000000057fbf0e343b2f42297b6b52526d5c2e88589a052",
              "0x0000000000000000000000008af5324a124a06f0348cb624fa0de9198a2da0cb",
            ],
            parseData:
              "0x00000000000000000000000000000000000000000000000ad78ebc5ac6200000",
            getEventTopic:
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            getEventSig: "Transfer(address,address,uint256)",
          },
          result: {
            getFunctionSig: {
              type: "function",
              name: "transfer",
              constant: false,
              inputs: [
                {
                  name: "recipient",
                  type: "address",
                  indexed: null,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "address",
                  _isParamType: true,
                },
                {
                  name: "amount",
                  type: "uint256",
                  indexed: null,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "uint256",
                  _isParamType: true,
                },
              ],
              outputs: [
                {
                  name: null,
                  type: "bool",
                  indexed: null,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "bool",
                  _isParamType: true,
                },
              ],
              payable: false,
              stateMutability: "nonpayable",
              gas: null,
              _isFragment: true,
            },
            getFunctionSighash: {
              type: "function",
              name: "transfer",
              constant: false,
              inputs: [
                {
                  name: "recipient",
                  type: "address",
                  indexed: null,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "address",
                  _isParamType: true,
                },
                {
                  name: "amount",
                  type: "uint256",
                  indexed: null,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "uint256",
                  _isParamType: true,
                },
              ],
              outputs: [
                {
                  name: null,
                  type: "bool",
                  indexed: null,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "bool",
                  _isParamType: true,
                },
              ],
              payable: false,
              stateMutability: "nonpayable",
              gas: null,
              _isFragment: true,
            },
            getEventWithSig: {
              name: "Transfer",
              anonymous: false,
              inputs: [
                {
                  name: "from",
                  type: "address",
                  indexed: true,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "address",
                  _isParamType: true,
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "address",
                  _isParamType: true,
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "uint256",
                  _isParamType: true,
                },
              ],
              type: "event",
              _isFragment: true,
            },
            getEventWithTopic: {
              name: "Transfer",
              anonymous: false,
              inputs: [
                {
                  name: "from",
                  type: "address",
                  indexed: true,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "address",
                  _isParamType: true,
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "address",
                  _isParamType: true,
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  components: null,
                  arrayLength: null,
                  arrayChildren: null,
                  baseType: "uint256",
                  _isParamType: true,
                },
              ],
              type: "event",
              _isFragment: true,
            },
            getSighash: "0xa9059cbb",
            getEventTopic:
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            encodeFunctionData:
              "0xa9059cbb0000000000000000000000008b4ab4667ad81af60e914a33f3aee35865825df60000000000000000000000000000000000000000000000056bc75e2d63100000",
            decodeFunctionData: [
              "0x8b4ab4667ad81af60e914a33f3aee35865825df6",
              "100000000000000000000",
            ],
            decodeEventLogData: [
              "0x57fbf0e343b2f42297b6b52526d5c2e88589a052",
              "0x8af5324a124a06f0348cb624fa0de9198a2da0cb",
              "200000000000000000000",
            ],
            encodeEventLogData: {
              data:
                "0x00000000000000000000000000000000000000000000000ad78ebc5ac6200000",
              topics: [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x00000000000000000000000057fbf0e343b2f42297b6b52526d5c2e88589a052",
                "0x0000000000000000000000008af5324a124a06f0348cb624fa0de9198a2da0cb",
              ],
            },
          },
        },
      },
    ],
  },
];

function fiscoTest(config: ProviderConfig, example: Example, abi: Interface) {
  const provider = new JsonRpcProvider(
    config.url,
    config.network,
    config.groupId
  );

  test("abi.getFunction by signature", () => {
    const result = abi.getFunction(
      example.abiTestData.function.functionFragmentSig
    );
    expect(result).toEqual(example.abiTestData.result.getFunctionSig);
  });

  test("abi.getFunction by sighash", () => {
    const result = abi.getFunction(
      example.abiTestData.function.functionFragmentSighash
    );
    expect(result).toEqual(example.abiTestData.result.getFunctionSighash);
  });

  test("abi.getEvent by signature", () => {
    const result = abi.getEvent(example.abiTestData.event.eventFragmentSig);
    expect(result).toEqual(example.abiTestData.result.getEventWithSig);
  });

  test("abi.getEvent by topic", () => {
    const result = abi.getEvent(example.abiTestData.event.eventFragmentTopic);
    expect(result).toEqual(example.abiTestData.result.getEventWithTopic);
  });

  test("abi.getSighash", () => {
    const result = abi.getSighash(
      example.abiTestData.function.functionFragmentSig
    );
    expect(result).toBe(example.abiTestData.result.getSighash);
  });

  test("abi.getEventTopic", () => {
    const result = abi.getEventTopic(
      example.abiTestData.event.eventFragmentSig
    );
    expect(result).toBe(example.abiTestData.result.getEventTopic);
  });

  test("abi.encodeFunctionData by signature", () => {
    const result = abi.encodeFunctionData(
      example.abiTestData.function.functionFragmentSig,
      example.abiTestData.function.encodeData
    );
    expect(result).toBe(example.abiTestData.result.encodeFunctionData);
  });

  test("abi.encodeFunctionData by sighash", () => {
    const result = abi.encodeFunctionData(
      example.abiTestData.function.functionFragmentSighash,
      example.abiTestData.function.encodeData
    );
    expect(result).toBe(example.abiTestData.result.encodeFunctionData);
  });

  test("abi.decodeFunctionData by signature", () => {
    const result = abi.decodeFunctionData(
      example.abiTestData.function.functionFragmentSig,
      example.abiTestData.function.decodeData
    );
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      example.abiTestData.result.decodeFunctionData
    );
  });

  test("abi.decodeFunctionData by sighash", () => {
    const result = abi.decodeFunctionData(
      example.abiTestData.function.functionFragmentSighash,
      example.abiTestData.function.decodeData
    );
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      example.abiTestData.result.decodeFunctionData
    );
  });

  test("abi.decodeEventLog by signature", () => {
    const result = abi.decodeEventLog(
      example.abiTestData.event.eventFragmentSig,
      example.abiTestData.event.decodeData,
      example.abiTestData.event.decodeTopic
    );
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      example.abiTestData.result.decodeEventLogData
    );
  });

  test("abi.decodeEventLog by topic", () => {
    const result = abi.decodeEventLog(
      example.abiTestData.event.eventFragmentTopic,
      example.abiTestData.event.decodeData,
      example.abiTestData.event.decodeTopic
    );
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      example.abiTestData.result.decodeEventLogData
    );
  });

  test("abi.encodeEventLog by signature", () => {
    const result = abi.encodeEventLog(
      example.abiTestData.event.eventFragmentSig,
      example.abiTestData.result.decodeEventLogData
    );
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      example.abiTestData.result.encodeEventLogData
    );
  });

  test("abi.encodeEventLog by topic", () => {
    const result = abi.encodeEventLog(
      example.abiTestData.event.eventFragmentTopic,
      example.abiTestData.result.decodeEventLogData
    );
    expect(JSON.parse(JSON.stringify(result))).toEqual(
      example.abiTestData.result.encodeEventLogData
    );
  });

  // Initialize wallet with mnem phrases
  let wallet = Wallet.fromMnemonic(example.walletMnemPhrase);
  wallet = wallet.connect(provider);

  test("provider.getClientVersion", () => {
    provider.getClientVersion().then((result) => {
      expect(result).toEqual(example.clientVersion);
    });
  });

  test("provider.getPbftView", () => {
    provider.getPbftView().then((result) => {
      expect(result).toBeTruthy();
    });
  });

  test("provider.getSealerList", () => {
    provider.getSealerList().then((result) => {
      expect(result).toEqual(example.sealerList);
    });
  });

  test("provider.getObserverList", () => {
    provider.getObserverList().then((result) => {
      expect(result).toEqual(example.observerList);
    });
  });

  test("provider.getSyncStatus", () => {
    provider.getSyncStatus().then((result) => {
      expect(result.blockNumber).toBeDefined();
      expect(result.genesisHash).toEqual(example.syncStatus.genesisHash);
      expect(result.isSyncing).toBeDefined();
      expect(result.knownHighestNumber).toBeDefined();
      expect(result.latestHash).toBeDefined();
      expect(result.knownLatestHash).toBeDefined();
      expect(result.latestHash).toBeDefined();
      expect(result.nodeId).toBeDefined();
      result.peers.forEach((peer) => {
        expect(peer.blockNumber).toBe(result.knownHighestNumber);
        expect(peer.genesisHash).toBe(result.genesisHash);
        expect(peer.latestHash).toBe(result.latestHash);
        expect(result.nodeId).toBeDefined();
      });
      expect(result.protocolId).toBe(example.syncStatus.protocolId);
      expect(result.txPoolSize).toBeDefined();
    });
  });

  test("provider.getPeers", (done) => {
    provider.getPeers().then((result) => {
      expect(result).toEqual(example.peers);
      done();
    });
  });

  test("provider.getNodeIdList", (done) => {
    provider.getNodeIdList().then((result) => {
      expect(result).toEqual(example.nodeIdList);
      done();
    });
  });

  test("provider.getBlockNumber", (done) => {
    provider.getBlockNumber().then((result) => {
      expect(result).toBeDefined();
      done();
    });
  });

  test("provider.getBlock by blockTag", (done) => {
    provider.getBlock(example.blockTag).then((block) => {
      expect(block).toEqual(example.blockByTag);
      done();
    });
  });

  test("provider.getBlock by blockHash", (done) => {
    provider.getBlock(example.blockHash).then((block) => {
      expect(block).toEqual(example.blockByAddress);
      done();
    });
  });

  test("provider.getBlockWithTransactions by blockTag", (done) => {
    provider.getBlockWithTransactions(example.blockTag).then((block) => {
      matchTransaction(block, example.blockWithTransactions);
      done();
    });
  });

  test("provider.getBlockWithTransactions by blockHash", (done) => {
    provider.getBlock(example.blockHash).then((block) => {
      matchTransaction(block, example.blockByAddress);
      done();
    });
  });

  test("provider.getGasPrice", (done) => {
    provider.getGasPrice().then((price) => {
      expect(price).toBeDefined();
      done();
    });
  });

  test("provider.sendTransaction", (done) => {
    provider.sendTransaction(example.signTransactionResult).then((response) => {
      expect(response.nonce).toEqual(
        example.providerSendTransactionResult.nonce
      );
      expect(response.gasPrice).toEqual(
        example.providerSendTransactionResult.gasPrice
      );
      expect(response.gasLimit).toEqual(
        example.providerSendTransactionResult.gasLimit
      );
      expect(response.to).toBe(example.providerSendTransactionResult.to);
      expect(response.value).toEqual(
        example.providerSendTransactionResult.value
      );
      expect(response.data).toBe(example.providerSendTransactionResult.data);
      expect(response.chainId).toBe(
        example.providerSendTransactionResult.chainId
      );
      expect(response.groupId).toBe(
        example.providerSendTransactionResult.groupId
      );
      expect(response.extraData).toBe(
        example.providerSendTransactionResult.extraData
      );
      expect(response.v).toBeDefined();
      expect(response.r).toBeDefined();
      expect(response.s).toBeDefined();
      expect(response.from).toBe(example.providerSendTransactionResult.from);
      expect(response.hash).toBeDefined();
      done();
    });
  });

  test("provider.estimateGas", (done) => {
    provider.estimateGas(example.testTransaction).then((result) => {
      expect(result).toEqual(example.estimateGasResult);
      done();
    });
  });

  test("Wallet.fromMnemonic", () => {
    const wallet = Wallet.fromMnemonic(example.walletMnemPhrase);
    wallet.getAddress().then((str) => {
      expect(str).toBe(example.mnemWalletAddr);
    });
  });

  test("Wallet.new", () => {
    const wallet = new Wallet(example.walletPrivKey);
    wallet.getAddress().then((str) => {
      expect(str).toBe(example.privKeyWalletAddr);
    });
  });

  test("Wallet.mnemonic", () => {
    expect(wallet.mnemonic.phrase).toBe(example.walletMnemPhrase);
  });

  test("Wallet.privateKey", () => {
    expect(wallet.privateKey).toBe(example.walletMnemPrivKey);
  });

  test("Wallet.publicKey", () => {
    expect(wallet.publicKey).toBe(example.walletPubkey);
  });

  test("wallet.call", (done) => {
    wallet.call(example.walletCallData).then((result) => {
      expect(result).toBe(example.walletCallResult);
      done();
    });
  });

  test("wallet.getChainId", (done) => {
    wallet.getChainId().then((result) => {
      expect(result).toBe(example.getGroupIdResult);
      done();
    });
  });

  test("wallet.getGroupId", (done) => {
    wallet.getGroupId().then((result) => {
      expect(result).toBe(example.getGroupIdResult);
      done();
    });
  });

  test("wallet.getBlockNumber", (done) => {
    wallet.getBlockNumber().then((result) => {
      expect(result).toBeDefined();
      done();
    });
  });

  test("wallet.getGasPrice", (done) => {
    wallet.getGasPrice().then((result) => {
      expect(result).toBeDefined();
      done();
    });
  });

  test("wallet.sendTransaction", (done) => {
    wallet.sendTransaction(example.testTransaction).then((tx) => {
      expect(tx.data).toBe(example.walletSendTransactionResult.data);
      expect(tx.chainId).toBe(example.walletSendTransactionResult.chainId);
      expect(tx.groupId).toBe(example.walletSendTransactionResult.groupId);
      expect(tx.extraData).toBe(example.walletSendTransactionResult.extraData);
      expect(tx.v).toBeDefined();
      expect(tx.r).toBeDefined();
      expect(tx.s).toBeDefined();
      expect(tx.from).toBeDefined();
      expect(tx.hash).toBeDefined();
      expect(tx.nonce).toBeDefined();
      expect(tx.gasLimit).toEqual(example.walletSendTransactionResult.gasLimit);
      expect(tx.gasPrice).toEqual(example.walletSendTransactionResult.gasPrice);
      done();
    });
  });

  test("wallet.signTransaction", (done) => {
    wallet.signTransaction(example.testTransaction).then((result) => {
      expect(result).toBe(example.signTransactionResult);
      done();
    });
  });

  test("wallet.provider.getTransaction", (done) => {
    wallet.provider.getTransaction(example.testTransactionAddr).then((tx) => {
      expect(tx.hash).toBeDefined();
      expect(tx.blockHash).toBeDefined();
      expect(tx.blockNumber).toBeDefined();
      expect(tx.confirmations).toBeDefined();
      expect(tx.from).toBeDefined();
      expect(tx.gasPrice).toEqual(example.getTransactionResult.gasPrice);
      expect(tx.gasLimit).toEqual(example.getTransactionResult.gasLimit);
      expect(tx.to).toBe(example.getTransactionResult.to);
      expect(tx.value).toEqual(example.getTransactionResult.value);
      expect(tx.nonce).toBeDefined();
      expect(tx.data).toBe(example.getTransactionResult.data);
      expect(tx.chainId).toBe(example.getTransactionResult.chainId);
      done();
    });
  });

  test("wallet.provider.getTransactionReceipt", (done) => {
    wallet.provider
      .getTransactionReceipt(example.testTransactionAddr)
      .then((tx) => {
        expect(tx.to).toBe(example.getTransactionReceiptResult.to);
        expect(tx.from).toBe(example.getTransactionReceiptResult.from);
        expect(tx.contractAddress).toBe(
          example.getTransactionReceiptResult.contractAddress
        );
        expect(tx.input).toBe(example.getTransactionReceiptResult.input);
        expect(tx.output).toBe(example.getTransactionReceiptResult.output);
        expect(tx.gasUsed).toEqual(example.getTransactionReceiptResult.gasUsed);
        expect(tx.logsBloom).toBe(
          example.getTransactionReceiptResult.logsBloom
        );
        expect(tx.blockHash).toBeDefined();
        expect(tx.blockNumber).toBeDefined();
        expect(tx.transactionHash).toBeDefined();
        expect(tx.transactionIndex).toBe(
          example.getTransactionReceiptResult.transactionIndex
        );
        expect(tx.confirmations).toBeDefined();
        expect(tx.status).toBeDefined();
        expect(tx.logs).toBeDefined();
        done();
      });
  });
}

function matchTransaction(block: BlockWithTransactions | Block, example: any) {
  // The mystery of all time
  expect(block.extraData).toStrictEqual(example.extraData);
  expect(block.gasLimit).toEqual(example.gasLimit);
  expect(block.gasUsed).toEqual(example.gasUsed);
  expect(block.hash).toBe(example.hash);
  expect(block.parentHash).toBe(example.parentHash);
  expect(block.number).toBe(example.number);
  expect(block.timestamp).toBeDefined();
  expect(block.sealer).toBe(example.sealer);
  expect(block.sealerList).toEqual(example.sealerList);

  block.transactions.forEach((transaction: any, index: number) => {
    if (typeof transaction === "object") {
      expect(transaction.hash).toBe(example.transactions[index].hash);
      expect(transaction.blockHash).toBe(example.transactions[index].blockHash);
      expect(transaction.blockNumber).toBe(
        example.transactions[index].blockNumber
      );
      // expect(transaction.transactionindex)
      expect(transaction.confirmations).toBeDefined();
      expect(transaction.from).toBe(example.transactions[index].from);
      expect(transaction.gasPrice).toEqual(
        example.transactions[index].gasPrice
      );
      expect(transaction.gasLimit).toEqual(
        example.transactions[index].gasLimit
      );
      expect(transaction.to).toBe(example.transactions[index].to);
      expect(transaction.value).toEqual(example.transactions[index].value);
      expect(transaction.nonce).toBeDefined();
      expect(transaction.data).toBe(example.transactions[index].data);
      // expect(transaction.creates)
      expect(transaction.chainId).toBe(example.transactions[index].chainId);
    } else if (typeof transaction === "string") {
      expect(transaction).toBe(example.transactions[index]);
    }
  });

  expect(block.stateRoot).toBe(example.stateRoot);
  expect(block.transactionsRoot).toBe(example.transactionsRoot);
  expect(block.receiptsRoot).toBe(example.receiptsRoot);
}

testData.forEach((data) => {
  data.examples.forEach((example) => {
    fiscoTest(data.providerConfig, example, data.abi);
  });
});

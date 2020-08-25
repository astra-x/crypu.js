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
 * @file provider.test.ts
 * @author Abnernat <zhang951005@gmail.com>
 * @date 2020
 */
'use strict';

import { BigNumber } from '@ethersproject/bignumber';
import { Network } from '@ethersproject/networks';

import {
  ClientVersion,
  SyncStatus,
  Peer,
  BlockTag,
  Block,
  BlockWithTransactions,
} from '@crypujs/abstract-provider';
import {
  Chain,
  JsonRpcProvider,
} from '@crypujs/providers';

const bnify = BigNumber.from;

// Interfaces
interface ProviderConfig {
  chain: Chain,
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
}

interface TestData {
  providerConfig: ProviderConfig;
  examples: Array<Example>;
}

const testData: Array<TestData> = [
  {
    providerConfig: {
      chain: Chain.FISCO,
      url: 'http://47.56.165.246:8545',
      network: {
        name: 'fisco-bcos',
        chainId: 1,
      },
      groupId: 1,
    },
    examples: [
      {
        clientVersion: {
          'Build Time': '20200619 06:32:10',
          'Build Type': 'Linux/clang/Release',
          'Chain Id': '1',
          'FISCO-BCOS Version': '2.5.0',
          'Git Branch': 'HEAD',
          'Git Commit Hash': '72c6d770e5cf0f4197162d0e26005ec03d30fcfe',
          'Supported Version': '2.5.0',
        },
        pbftView: '0xc588',
        sealerList: [
          '12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e',
          '3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a',
          '8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0',
          'f3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8',
        ],
        observerList: [],
        syncStatus: {
          blockNumber: 28536,
          genesisHash:
            'e20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0',
          isSyncing: false,
          knownHighestNumber: 28536,
          knownLatestHash:
            'b7b64f7935f8343ad724eeedc97fc6460c375f68767eb9c9a406aa91f770d2cd',
          latestHash:
            'b7b64f7935f8343ad724eeedc97fc6460c375f68767eb9c9a406aa91f770d2cd',
          nodeId:
            'f3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8',
          peers: [
            {
              blockNumber: 28536,
              genesisHash:
                'e20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0',
              latestHash:
                'b7b64f7935f8343ad724eeedc97fc6460c375f68767eb9c9a406aa91f770d2cd',
              nodeId:
                '12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e',
            },
            {
              blockNumber: 28536,
              genesisHash:
                'e20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0',
              latestHash:
                'b7b64f7935f8343ad724eeedc97fc6460c375f68767eb9c9a406aa91f770d2cd',
              nodeId:
                '3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a',
            },
            {
              blockNumber: 28536,
              genesisHash:
                'e20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0',
              latestHash:
                'b7b64f7935f8343ad724eeedc97fc6460c375f68767eb9c9a406aa91f770d2cd',
              nodeId:
                '8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0',
            },
          ],
          protocolId: 65545,
          txPoolSize: '0',
        },
        peers: [
          {
            Agency: 'agency-a',
            IPAndPort: '127.0.0.1:30301',
            Node: 'node_127.0.0.1_30301',
            NodeID:
              '12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e',
            Topic: [],
          },
          {
            Agency: 'agency-b',
            IPAndPort: '127.0.0.1:30302',
            Node: 'node_127.0.0.1_30302',
            NodeID:
              '3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a',
            Topic: [],
          },
          {
            Agency: 'agency-b',
            IPAndPort: '127.0.0.1:30303',
            Node: 'node_127.0.0.1_30303',
            NodeID:
              '8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0',
            Topic: [],
          },
        ],
        nodeIdList: [
          'f3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8',
          '12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e',
          '3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a',
          '8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0',
        ],
        groupList: [1],
        blockTag: 0x1,
        blockByTag: {
          extraData: [],
          gasLimit: { _hex: '0x00', _isBigNumber: true },
          gasUsed: { _hex: '0x00', _isBigNumber: true },
          hash:
            '0x3bc32897ea43e6667ffb0409990dbdea218525d754bcee354ce45c8b97a24df7',
          parentHash:
            '0xe20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0',
          number: 1,
          timestamp: 1593594576348,
          sealer: '0x1',
          sealerList: [
            '0x12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e',
            '0x3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a',
            '0x8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0',
            '0xf3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8',
          ],
          transactions: [
            '0x2ed687722049a4fb94f1ce34714f5b20003bd2cf089530203754ca83458fb4a3',
          ],
          stateRoot:
            '0x4c73e4c0827a23e5ad4a0c8d7c9be31a7e0db6f3cbd29857dfb7c86734aab723',
          transactionsRoot:
            '0x615b947f3ed7ee1d92c242bf727a5ee76b0fe1537d9d39066c02b203dddeeb35',
          receiptsRoot:
            '0x972d23e051bcd1a345b0d7872d30e09b798e7702e684e62dd0ca2404c55e930a',
        },
        blockHash:
          '0x3bc32897ea43e6667ffb0409990dbdea218525d754bcee354ce45c8b97a24df7',
        blockByAddress: {
          extraData: [],
          gasLimit: { _hex: '0x00', _isBigNumber: true },
          gasUsed: { _hex: '0x00', _isBigNumber: true },
          hash:
            '0x3bc32897ea43e6667ffb0409990dbdea218525d754bcee354ce45c8b97a24df7',
          parentHash:
            '0xe20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0',
          number: 1,
          timestamp: 1593594576348,
          sealer: '0x1',
          sealerList: [
            '0x12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e',
            '0x3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a',
            '0x8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0',
            '0xf3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8',
          ],
          transactions: [
            '0x2ed687722049a4fb94f1ce34714f5b20003bd2cf089530203754ca83458fb4a3',
          ],
          stateRoot:
            '0x4c73e4c0827a23e5ad4a0c8d7c9be31a7e0db6f3cbd29857dfb7c86734aab723',
          transactionsRoot:
            '0x615b947f3ed7ee1d92c242bf727a5ee76b0fe1537d9d39066c02b203dddeeb35',
          receiptsRoot:
            '0x972d23e051bcd1a345b0d7872d30e09b798e7702e684e62dd0ca2404c55e930a',
        },
        blockWithTransactions: {
          extraData: [],
          gasLimit: bnify(0x00),
          gasUsed: bnify(0x00),
          hash:
            '0x3bc32897ea43e6667ffb0409990dbdea218525d754bcee354ce45c8b97a24df7',
          parentHash:
            '0xe20e59e7dc025d979ffafafe8ef19f13d4060715b0f16f1050bdf7710e98ebd0',
          number: 1,
          timestamp: 1593594576348,
          sealer: '0x1',
          sealerList: [
            '0x12560d0039c511a2a71b99bcf9267d0d21c4a8ff3beb1a80920c467b3d03150d5d1f2a7fc926457a1fbff3f7cd9000bfe97973294267859a7299a968635ef09e',
            '0x3742a0ed065590ee448f013d16d3031ad6094148b6ac03fd80ecf3cf4ecde46d5299a5a4e5bbac26915d1f4a136537dafaf5666de8d199ce9a5831e789231c1a',
            '0x8b07270fcd9d5ac06c330a6beeb753b0b3daeb15623874aa733fdd81c3f9474a2e593a661444c38b02117bb45a8f765a663f7b67173965a45e37103e6e5515d0',
            '0xf3a1353a38f2022cc3a5b55e443e85eeb17e411dc4944aa74d1b9050880cf4c96b0014107703ede6bd551365def290936f47288a7e7cd90abde0ba5b3b4695e8',
          ],
          transactions: [
            {
              hash:
                '0x2ed687722049a4fb94f1ce34714f5b20003bd2cf089530203754ca83458fb4a3',
              blockHash:
                '0x3bc32897ea43e6667ffb0409990dbdea218525d754bcee354ce45c8b97a24df7',
              blockNumber: 1,
              transactionIndex: 0,
              from: '0xc674ce8E3535455F0CA6643A248F53f97A923061',
              gasPrice: bnify(0x01),
              gasLimit: bnify(0x05f5e100),
              to: null,
              value: bnify(0x00),
              data:
                '0x608060405234801561001057600080fd5b506040805190810160405280600d81526020017f48656c6c6f2c20576f726c6421000000000000000000000000000000000000008152506000908051906020019061005c929190610062565b50610107565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100a357805160ff19168380011785556100d1565b828001600101855582156100d1579182015b828111156100d05782518255916020019190600101906100b5565b5b5090506100de91906100e2565b5090565b61010491905b808211156101005760008160009055506001016100e8565b5090565b90565b6102d7806101166000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063299f7f9d146100515780633590b49f146100e1575b600080fd5b34801561005d57600080fd5b5061006661014a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100a657808201518184015260208101905061008b565b50505050905090810190601f1680156100d35780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156100ed57600080fd5b50610148600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506101ec565b005b606060008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156101e25780601f106101b7576101008083540402835291602001916101e2565b820191906000526020600020905b8154815290600101906020018083116101c557829003601f168201915b5050505050905090565b8060009080519060200190610202929190610206565b5050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061024757805160ff1916838001178555610275565b82800160010185558215610275579182015b82811115610274578251825591602001919060010190610259565b5b5090506102829190610286565b5090565b6102a891905b808211156102a457600081600090555060010161028c565b5090565b905600a165627a7a7230582034688ac8350127435a19e92899a5416c4de4ec226511ea42975eb0e5a062bfdf0029',
              creates: '0x2921E14581eb0AFeAbf061648e5C4DfFf309c0b3',
              chainId: 0,
            },
          ],
          stateRoot:
            '0x4c73e4c0827a23e5ad4a0c8d7c9be31a7e0db6f3cbd29857dfb7c86734aab723',
          transactionsRoot:
            '0x615b947f3ed7ee1d92c242bf727a5ee76b0fe1537d9d39066c02b203dddeeb35',
          receiptsRoot:
            '0x972d23e051bcd1a345b0d7872d30e09b798e7702e684e62dd0ca2404c55e930a',
        },
      },
    ],
  },
];

function testProvider(providerConf: ProviderConfig, example: Example) {
  const provider = new JsonRpcProvider(
    providerConf.chain,
    providerConf.url,
    providerConf.network,
    providerConf.groupId
  );

  test('provider.getClientVersion', () => {
    provider.getClientVersion().then((result) => {
      expect(result).toEqual(example.clientVersion);
    });
  });

  test('provider.getPbftView', () => {
    provider.getPbftView().then((result) => {
      expect(result).toBeTruthy();
    });
  });

  test('provider.getSealerList', () => {
    provider.getSealerList().then((result) => {
      expect(result).toEqual(example.sealerList);
    });
  });

  test('provider.getObserverList', () => {
    provider.getObserverList().then((result) => {
      expect(result).toEqual(example.observerList);
    });
  });

  test('provider.getSyncStatus', () => {
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

  test('provider.getPeers', (done) => {
    provider.getPeers().then((result) => {
      expect(result).toEqual(example.peers);
      done();
    });
  });

  test('provider.getNodeIdList', (done) => {
    provider.getNodeIdList().then((result) => {
      expect(result).toEqual(example.nodeIdList);
      done();
    });
  });

  test('provider.getBlockNumber', (done) => {
    provider.getBlockNumber().then((result) => {
      expect(result).toBeDefined();
      done();
    });
  });

  test('provider.getBlock by blockTag', (done) => {
    provider.getBlock(example.blockTag).then((block) => {
      expect(block).toEqual(example.blockByTag);
      done();
    });
  });

  test('provider.getBlock by blockHash', (done) => {
    provider.getBlock(example.blockHash).then((block) => {
      expect(block).toEqual(example.blockByAddress);
      done();
    });
  });

  test('provider.getBlockWithTransactions', (done) => {
    provider.getBlockWithTransactions(example.blockTag).then((block) => {
      matchTransaction(block, example.blockWithTransactions);
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
    if (typeof transaction === 'object') {
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
    } else if (typeof transaction === 'string') {
      expect(transaction).toBe(example.transactions[index]);
    }
  });

  expect(block.stateRoot).toBe(example.stateRoot);
  expect(block.transactionsRoot).toBe(example.transactionsRoot);
  expect(block.receiptsRoot).toBe(example.receiptsRoot);
}

testData.forEach((data: TestData) => {
  const providerConfig: ProviderConfig = data.providerConfig;
  const testExamples: Array<Example> = data.examples;
  testExamples.forEach((example: Example) => {
    testProvider(providerConfig, example);
  });
});

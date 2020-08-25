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
 * @file wallet.test.ts
 * @author Abnernat <zhang951005@gmail.com>
 * @date 2020
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_1 = require("@ethersproject/bignumber");
var abi_1 = require("@crypujs/abi");
var providers_1 = require("@crypujs/providers");
var wallet_1 = require("@crypujs/wallet");
var bnify = bignumber_1.BigNumber.from;
var roleControllerAbi = [
    {
        constant: true,
        inputs: [],
        name: 'MODIFY_ADMIN',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'RETURN_CODE_FAILURE_NO_PERMISSION',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'addr',
                type: 'address',
            },
            {
                name: 'role',
                type: 'uint256',
            },
        ],
        name: 'checkRole',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'ROLE_COMMITTEE',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'addr',
                type: 'address',
            },
            {
                name: 'role',
                type: 'uint256',
            },
        ],
        name: 'removeRole',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'MODIFY_KEY_CPT',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'addr',
                type: 'address',
            },
            {
                name: 'role',
                type: 'uint256',
            },
        ],
        name: 'addRole',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'addr',
                type: 'address',
            },
            {
                name: 'operation',
                type: 'uint256',
            },
        ],
        name: 'checkPermission',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'MODIFY_AUTHORITY_ISSUER',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'MODIFY_COMMITTEE',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'ROLE_ADMIN',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'ROLE_AUTHORITY_ISSUER',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
];
var testData = [
    {
        providerConfig: {
            chain: providers_1.Chain.FISCO,
            url: 'http://47.56.165.246:8545',
            network: {
                name: 'fisco-bcos',
                chainId: 1,
            },
            groupId: 1,
        },
        examples: [
            {
                walletCallData: {
                    from: '0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6',
                    to: '0x2f7bbf70d7052b4b33e3f7e0347efce131801e64',
                    data: new abi_1.Interface(roleControllerAbi).encodeFunctionData('checkPermission(address,uint)', [
                        '0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6',
                        201,
                    ]),
                },
                testTransactionAddr: '0xdf06b656004645b727c628a3a574abd0c4f56be8d2b328eac56eef5bcbaf1f95',
                mnemWalletAddr: '0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6',
                privKeyWalletAddr: '0xc674ce8E3535455F0CA6643A248F53f97A923061',
                testTransaction: {
                    data: '0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000',
                    to: '0x3a1c406f0af920f9371d3b75b8f8c1a14264fd37',
                },
                sendTransactionResult: {
                    nonce: {
                        _hex: '0x6ea7b57109ec897f37d7492b34747245',
                        _isBigNumber: true,
                    },
                    gasPrice: bnify(0x11e1a300),
                    gasLimit: bnify(0x0f4240),
                    blockLimit: bnify(0x6fdc),
                    to: '0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37',
                    value: bnify(0x00),
                    data: '0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000',
                    chainId: 1,
                    groupId: 1,
                    extraData: '0x',
                    v: 27,
                    r: '0x3d348b651c147f99e9e79c38fac8d55671de5fd150fe55c4e4fec63ae53c9a0f',
                    s: '0x364f8d902a247a9f6ee6de8d33318673372ea860b066c40ab702b548418313a3',
                    from: '0xc674ce8E3535455F0CA6643A248F53f97A923061',
                    hash: '0xff0e19e29aa94efc32044f9f0b2c783bfe2f9dccb82b303d2883773d6487ba9f',
                },
                getTransactionReceiptResult: {
                    to: '0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37',
                    from: '0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6',
                    contractAddress: '0x0000000000000000000000000000000000000000',
                    input: '0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000',
                    output: '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000023331000000000000000000000000000000000000000000000000000000000000',
                    root: '0x97f48fae00dc51f5e16502414db04d31cda99cef65cf42f133bf2f2133593b24',
                    gasUsed: bnify(0xd059),
                    logsBloom: '0x00000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000004080000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000001000000000000000000001000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000100000000000000',
                    blockHash: '0xe2daf45a1b6af33743c6d2a392a880db7a782e36e45b331c708753ee74a3ddda',
                    blockNumber: 28304,
                    transactionHash: '0xdf06b656004645b727c628a3a574abd0c4f56be8d2b328eac56eef5bcbaf1f95',
                    transactionIndex: 0,
                    logs: [
                        {
                            address: '0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37',
                            data: '0x',
                            topics: [
                                '0xc70d9e3cda68d24f5c9a96a00e240c9765756eeeb308ed7da2ba63cfe23d1f2a',
                                '0x000000000000000000000000000000000000000000000000000000000000001f',
                            ],
                        },
                    ],
                    confirmations: 174,
                    status: 0,
                },
                getTransactionResult: {
                    hash: '0xdf06b656004645b727c628a3a574abd0c4f56be8d2b328eac56eef5bcbaf1f95',
                    blockHash: '0xe2daf45a1b6af33743c6d2a392a880db7a782e36e45b331c708753ee74a3ddda',
                    blockNumber: 28304,
                    transactionIndex: 0,
                    confirmations: 233,
                    from: '0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6',
                    gasPrice: bnify(0x11e1a300),
                    gasLimit: bnify(0x0f4240),
                    to: '0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37',
                    value: bnify(0x00),
                    nonce: {
                        _hex: '0x4cfeb89292ea62c2712a2dcafd2ba2c7',
                        _isBigNumber: true,
                    },
                    data: '0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000',
                    creates: null,
                    chainId: 0,
                },
                populateTransactionResult: {
                    data: '0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000',
                    to: '0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37',
                    from: '0xc674ce8E3535455F0CA6643A248F53f97A923061',
                    nonce: '0xb819f5906213b8c355b3ad9079e91ee2',
                    blockLimit: 28636,
                    chainId: 1,
                    groupId: 1,
                    gasPrice: bnify(0x11e1a300),
                    gasLimit: bnify(0x0f4240),
                },
                serializeResult: '0xf8bc90b819f5906213b8c355b3ad9079e91ee28411e1a300830f4240826fdc943a1c406f0af920f9371d3b75b8f8c1a14264fd3780b884643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000010180',
                signTransactionResult: '0xf8ff90b819f5906213b8c355b3ad9079e91ee28411e1a300830f4240826fdc943a1c406f0af920f9371d3b75b8f8c1a14264fd3780b8846437197700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000361626300000000000000000000000000000000000000000000000000000000000101801ca089ef906ba24237ce157694b495ca192701f3a3e6d8368d690ed3b3d011643dcaa04d9a6a825d7bc5a09d59673e17dd8ac16752ce19ad9f01220f3d6c09792ca4a1',
                walletMnemPhrase: 'ribbon glimpse rescue nuclear elevator album rookie imitate fuel resemble banner arrow',
                walletCallResult: '0x0000000000000000000000000000000000000000000000000000000000000000',
                walletPkey: '0x1925b8bee81b6189e0a3aa0e6ce99e7c3deaf8bdf8767ee388ff15e78eae863e',
            },
        ],
    },
];
function testWallet(providerConf, example) {
    var provider = new providers_1.JsonRpcProvider(providerConf.chain, providerConf.url, providerConf.network, providerConf.groupId);
    // Initialize wallet with mnem phrases
    var wallet = wallet_1.Wallet.fromMnemonic(example.walletMnemPhrase);
    wallet = wallet.connect(provider);
    test('Wallet.fromMnemonic', function () {
        var wallet = wallet_1.Wallet.fromMnemonic(example.walletMnemPhrase);
        wallet.getAddress().then(function (str) {
            expect(str).toBe(example.mnemWalletAddr);
        });
    });
    test('Wallet.new', function () {
        var wallet = new wallet_1.Wallet(example.walletPkey);
        wallet.getAddress().then(function (str) {
            expect(str).toBe(example.privKeyWalletAddr);
        });
    });
    test('wallet.call', function (done) {
        wallet.call(example.walletCallData).then(function (result) {
            expect(result).toBe(example.walletCallResult);
            done();
        });
    });
    test('wallet.populateTransaction', function (done) {
        wallet.populateTransaction(example.testTransaction).then(function (tx) {
            expect(tx.blockLimit).toBeDefined();
            expect(tx.data).toBe(example.populateTransactionResult.data);
            expect(tx.to).toBe(example.populateTransactionResult.to);
            expect(tx.from).toBeDefined();
            expect(tx.nonce).toBeDefined();
            expect(tx.chainId).toBe(example.populateTransactionResult.chainId);
            expect(tx.groupId).toBe(example.populateTransactionResult.groupId);
            expect(tx.gasPrice).toEqual(example.populateTransactionResult.gasPrice);
            expect(tx.gasLimit).toEqual(example.populateTransactionResult.gasLimit);
            done();
        });
    });
    test('wallet.sendTransaction', function (done) {
        wallet.sendTransaction(example.testTransaction).then(function (tx) {
            expect(tx.data).toBe(example.sendTransactionResult.data);
            expect(tx.chainId).toBe(example.sendTransactionResult.chainId);
            expect(tx.groupId).toBe(example.sendTransactionResult.groupId);
            expect(tx.extraData).toBe(example.sendTransactionResult.extraData);
            expect(tx.v).toBeDefined();
            expect(tx.r).toBeDefined();
            expect(tx.s).toBeDefined();
            expect(tx.from).toBeDefined();
            expect(tx.hash).toBeDefined();
            expect(tx.nonce).toBeDefined();
            expect(tx.gasLimit).toEqual(example.sendTransactionResult.gasLimit);
            expect(tx.gasPrice).toEqual(example.sendTransactionResult.gasPrice);
            done();
        });
    });
    test('wallet.provider.getTransaction', function (done) {
        wallet.provider.getTransaction(example.testTransactionAddr).then(function (tx) {
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
    test('wallet.provider.getTransactionReceipt', function (done) {
        wallet.provider
            .getTransactionReceipt(example.testTransactionAddr)
            .then(function (tx) {
            expect(tx.to).toBe(example.getTransactionReceiptResult.to);
            expect(tx.from).toBe(example.getTransactionReceiptResult.from);
            expect(tx.contractAddress).toBe(example.getTransactionReceiptResult.contractAddress);
            expect(tx.input).toBe(example.getTransactionReceiptResult.input);
            expect(tx.output).toBe(example.getTransactionReceiptResult.output);
            expect(tx.gasUsed).toEqual(example.getTransactionReceiptResult.gasUsed);
            expect(tx.logsBloom).toBe(example.getTransactionReceiptResult.logsBloom);
            expect(tx.blockHash).toBeDefined();
            expect(tx.blockNumber).toBeDefined();
            expect(tx.transactionHash).toBeDefined();
            expect(tx.transactionIndex).toBe(example.getTransactionReceiptResult.transactionIndex);
            expect(tx.confirmations).toBeDefined();
            expect(tx.status).toBeDefined();
            expect(tx.logs).toBeDefined();
            done();
        });
    });
}
testData.forEach(function (data) {
    var providerConfig = data.providerConfig;
    var testExample = data.examples;
    testExample.forEach(function (example) {
        testWallet(providerConfig, example);
    });
});

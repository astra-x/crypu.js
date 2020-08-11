import { Wallet } from "@crypujs/wallet";
import { BigNumber } from "@ethersproject/bignumber";
import { JsonRpcProvider } from "@crypujs/providers";
const bnify = BigNumber.from;
const testData = [
    {
        providerConfig: {
            url: "http://47.56.165.246:8545",
            network: {
                name: "fisco-bcos",
                chainId: 1,
            },
            groupId: 1,
        },
        examples: [
            {
                testTransactionAddr: "0xdf06b656004645b727c628a3a574abd0c4f56be8d2b328eac56eef5bcbaf1f95",
                mnemWalletAddr: "0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6",
                privKeyWalletAddr: "0xc674ce8E3535455F0CA6643A248F53f97A923061",
                testTransaction: {
                    data: "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
                    to: "0x3a1c406f0af920f9371d3b75b8f8c1a14264fd37",
                },
                sendTransactionResult: {
                    nonce: {
                        _hex: "0x6ea7b57109ec897f37d7492b34747245",
                        _isBigNumber: true,
                    },
                    gasPrice: bnify(0x11e1a300),
                    gasLimit: bnify(0x0f4240),
                    blockLimit: bnify(0x6fdc),
                    to: "0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37",
                    value: bnify(0x00),
                    data: "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
                    chainId: 1,
                    groupId: 1,
                    extraData: "0x",
                    v: 27,
                    r: "0x3d348b651c147f99e9e79c38fac8d55671de5fd150fe55c4e4fec63ae53c9a0f",
                    s: "0x364f8d902a247a9f6ee6de8d33318673372ea860b066c40ab702b548418313a3",
                    from: "0xc674ce8E3535455F0CA6643A248F53f97A923061",
                    hash: "0xff0e19e29aa94efc32044f9f0b2c783bfe2f9dccb82b303d2883773d6487ba9f",
                },
                getTransactionReceiptResult: {
                    to: "0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37",
                    from: "0x8b4AB4667ad81AF60e914A33F3AEE35865825DF6",
                    contractAddress: "0x0000000000000000000000000000000000000000",
                    input: "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
                    output: "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000023331000000000000000000000000000000000000000000000000000000000000",
                    root: "0x97f48fae00dc51f5e16502414db04d31cda99cef65cf42f133bf2f2133593b24",
                    gasUsed: bnify(0xd059),
                    logsBloom: "0x00000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000004080000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000001000000000000000000001000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000100000000000000",
                    blockHash: "0xe2daf45a1b6af33743c6d2a392a880db7a782e36e45b331c708753ee74a3ddda",
                    blockNumber: 28304,
                    transactionHash: "0xdf06b656004645b727c628a3a574abd0c4f56be8d2b328eac56eef5bcbaf1f95",
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
                    hash: "0xdf06b656004645b727c628a3a574abd0c4f56be8d2b328eac56eef5bcbaf1f95",
                    blockHash: "0xe2daf45a1b6af33743c6d2a392a880db7a782e36e45b331c708753ee74a3ddda",
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
                    data: "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
                    creates: null,
                    chainId: 0,
                },
                populateTransactionResult: {
                    data: "0x643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000",
                    to: "0x3A1C406F0Af920F9371d3B75B8f8C1A14264FD37",
                    from: "0xc674ce8E3535455F0CA6643A248F53f97A923061",
                    nonce: "0xb819f5906213b8c355b3ad9079e91ee2",
                    blockLimit: 28636,
                    chainId: 1,
                    groupId: 1,
                    gasPrice: bnify(0x11e1a300),
                    gasLimit: bnify(0x0f4240),
                },
                serializeResult: "0xf8bc90b819f5906213b8c355b3ad9079e91ee28411e1a300830f4240826fdc943a1c406f0af920f9371d3b75b8f8c1a14264fd3780b884643719770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000010180",
                signTransactionResult: "0xf8ff90b819f5906213b8c355b3ad9079e91ee28411e1a300830f4240826fdc943a1c406f0af920f9371d3b75b8f8c1a14264fd3780b8846437197700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000361626300000000000000000000000000000000000000000000000000000000000101801ca089ef906ba24237ce157694b495ca192701f3a3e6d8368d690ed3b3d011643dcaa04d9a6a825d7bc5a09d59673e17dd8ac16752ce19ad9f01220f3d6c09792ca4a1",
                walletMnemPhrase: "ribbon glimpse rescue nuclear elevator album rookie imitate fuel resemble banner arrow",
                walletPkey: "0x1925b8bee81b6189e0a3aa0e6ce99e7c3deaf8bdf8767ee388ff15e78eae863e",
            },
        ],
    },
];
function testWallet(providerConf, example) {
    const provider = new JsonRpcProvider(providerConf.url, providerConf.network, providerConf.groupId);
    // Initialize wallet with mnem phrases
    let wallet = Wallet.fromMnemonic(example.walletMnemPhrase);
    wallet = wallet.connect(provider);
    test("Create wallet from mnemonic words", () => {
        const wallet = Wallet.fromMnemonic(example.walletMnemPhrase);
        wallet.getAddress().then((str) => {
            expect(str).toBe(example.mnemWalletAddr);
        });
    });
    test("Create wallet from privkey", () => {
        const wallet = new Wallet(example.walletPkey);
        wallet.getAddress().then((str) => {
            expect(str).toBe(example.privKeyWalletAddr);
        });
    });
    test("Population transaction from transaction provided", (done) => {
        wallet.populateTransaction(example.testTransaction).then((tx) => {
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
    test("Send transaction", (done) => {
        wallet.sendTransaction(example.testTransaction).then((tx) => {
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
    test("Get transaction", (done) => {
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
    test("get transaction receipt", (done) => {
        wallet.provider
            .getTransactionReceipt(example.testTransactionAddr)
            .then((tx) => {
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
testData.forEach((data) => {
    const providerConfig = data.providerConfig;
    const testExample = data.examples;
    testExample.forEach((example) => {
        testWallet(providerConfig, example);
    });
});

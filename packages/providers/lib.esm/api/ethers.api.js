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
 * @file ethers.api.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
export const Api = {
    detectChainId: (send) => {
        return () => send('eth_chainId', []);
    },
    prepareRequest: (method, params) => {
        switch (method) {
            case 'getBlockNumber':
                return ['eth_blockNumber', []];
            case 'getGasPrice':
                return ['eth_gasPrice', []];
            case 'getBalance':
                return ['eth_getBalance', [params.address.toLowerCase(), params.blockTag]];
            case 'getTransactionCount':
                return ['eth_getTransactionCount', [params.address.toLowerCase(), params.blockTag]];
            case 'getCode':
                return ['eth_getCode', [params.address.toLowerCase(), params.blockTag]];
            case 'getStorageAt':
                return ['eth_getStorageAt', [params.address.toLowerCase(), params.position, params.blockTag]];
            case 'sendTransaction':
                return ['eth_sendRawTransaction', [params.signedTransaction]];
            case 'getBlock':
                if (params.blockTag) {
                    return ['eth_getBlockByNumber', [params.blockTag, !!params.includeTransactions]];
                }
                else if (params.blockHash) {
                    return ['eth_getBlockByHash', [params.blockHash, !!params.includeTransactions]];
                }
                return null;
            case 'getTransaction':
                return ['eth_getTransactionByHash', [params.transactionHash]];
            case 'getTransactionReceipt':
                return ['eth_getTransactionReceipt', [params.transactionHash]];
            case 'call': {
                return ['eth_call', [params.transaction, params.blockTag]];
            }
            case 'estimateGas': {
                return ['eth_estimateGas', [params.transaction]];
            }
            case 'getLogs':
                if (params.filter && params.filter.address != null) {
                    params.filter.address = params.filter.address.toLowerCase();
                }
                return ['eth_getLogs', [params.filter]];
            default:
                break;
        }
        return null;
    },
};

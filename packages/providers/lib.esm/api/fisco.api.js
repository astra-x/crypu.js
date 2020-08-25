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
 * @file fisco.api.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
export const Api = {
    prepareRequest: (groupId) => {
        return (method, params) => {
            switch (method) {
                case 'getClientVersion':
                    return ['getClientVersion', []];
                case 'getPbftView':
                    return ['getPbftView', [groupId]];
                case 'getSealerList':
                    return ['getSealerList', [groupId]];
                case 'getObserverList':
                    return ['getObserverList', [groupId]];
                case 'getSyncStatus':
                    return ['getSyncStatus', [groupId]];
                case 'getPeers':
                    return ['getPeers', [groupId]];
                case 'getNodeIdList':
                    return ['getNodeIDList', [groupId]];
                case 'getGroupList':
                    return ['getGroupList', [groupId]];
                case 'getBlockNumber':
                    return ['getBlockNumber', [groupId]];
                case 'getBlock':
                    if (params.blockTag) {
                        return ['getBlockByNumber', [groupId, params.blockTag, !!params.includeTransactions]];
                    }
                    else if (params.blockHash) {
                        return ['getBlockByHash', [groupId, params.blockHash, !!params.includeTransactions]];
                    }
                    break;
                case 'sendTransaction':
                    return ['sendRawTransaction', [groupId, params.signedTransaction]];
                case 'getTransaction':
                    return ['getTransactionByHash', [groupId, params.transactionHash]];
                case 'getTransactionReceipt':
                    return ['getTransactionReceipt', [groupId, params.transactionHash]];
                case 'call':
                    return ['call', [groupId, params.transaction]];
                default:
                    break;
            }
            return null;
        };
    },
};

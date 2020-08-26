/**
 * @file ethers.api.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
export declare const Api: {
    detectChainId: (send: (method: string, params: Array<any>) => Promise<any>) => () => Promise<number>;
    prepareRequest: (method: string, params: any) => [string, Array<any>];
};

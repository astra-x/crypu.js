/**
 * @file fisco.api.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
export declare var Api: {
    prepareRequest: (groupId: number) => (method: string, params: any) => [string, Array<any>];
};

/**
 * @file response.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
export interface Response<T> {
    id: number;
    jsonrpc: '2.0';
    result: T;
}

/**
 * @file request.dto.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
export interface Request<T, R> {
    id: number;
    jsonrpc: '2.0';
    method: T;
    params?: R;
}

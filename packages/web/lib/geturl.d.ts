/**
 * @file geturl.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
export declare type GetUrlResponse = {
    statusCode: number;
    statusMessage: string;
    headers: {
        [key: string]: string;
    };
    body: string;
};
export declare type Options = {
    method?: string;
    body?: string;
    headers?: {
        [key: string]: string;
    };
};
export declare function getUrl(href: string, options?: Options): Promise<GetUrlResponse>;

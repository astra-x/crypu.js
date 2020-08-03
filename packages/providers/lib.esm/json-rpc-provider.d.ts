/**
 * @file json-rpc-provider.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Networkish, Network } from '@ethersproject/networks';
import { Response } from './dto/response.dto';
import { Formatter } from './formatter';
import { BaseProvider } from './base-provider';
interface Connection {
    url: string;
}
export declare class JsonRpcProvider extends BaseProvider {
    _nextId: number;
    readonly connection: Connection;
    constructor(url?: string, network?: Network | Promise<Network>, groupId?: number);
    static defaultUrl(): string;
    static defaultNetwork(): Promise<Network>;
    static getFormatter(): Formatter;
    static getNetwork(network: Networkish): Network;
    detectNetwork(): Promise<Network>;
    getResult(payload: Response<any>): any;
    prepareRequest(method: string, params: any): [string, Array<any>];
    send(method: string, params: Array<any>): Promise<any>;
    perform(method: string, params: any): Promise<any>;
}
export {};

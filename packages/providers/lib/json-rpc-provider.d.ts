/**
 * @file json-rpc-provider.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { Networkish, Network } from '@ethersproject/networks';
import { Chain } from './constants';
import { Response } from './dto/response.dto';
import { Formatter } from './formatter';
import { BaseProvider } from './base-provider';
interface Connection {
    url: string;
}
export declare class JsonRpcProvider extends BaseProvider {
    _nextId: number;
    readonly connection: Connection;
    readonly getChainId: () => Promise<number>;
    readonly prepareRequest: (method: string, params: any) => [string, Array<any>];
    constructor(chain: Chain, url?: string, network?: Network | Promise<Network>, groupId?: number);
    static getFormatter(): Formatter;
    static defaultUrl(): string;
    static defaultNetwork(): Promise<Network>;
    static getNetwork(network: Networkish): Network;
    static getChainId(chain: Chain, send: (method: string, params: Array<any>) => Promise<any>): () => Promise<number>;
    static prepareRequest(chain: Chain, _: Network, groupId: number): (method: string, params: any) => [string, Array<any>];
    detectNetwork(): Promise<Network>;
    result(payload: Response<any>): any;
    send(method: string, params: Array<any>): Promise<any>;
    perform(method: string, params: any): Promise<any>;
}
export {};

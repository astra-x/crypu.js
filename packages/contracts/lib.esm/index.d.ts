/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { JsonFragment, Fragment, Interface } from '@crypujs/abi';
import { Provider } from '@crypujs/abstract-provider';
import { Signer } from '@crypujs/abstract-signer';
export declare type ContractInterface = string | Array<Fragment | JsonFragment | string> | Interface;
export declare type ContractFunction<T = any> = (...args: Array<any>) => Promise<T>;
export declare class Contract {
    readonly signer: Signer;
    readonly provider: Provider;
    readonly address: string;
    readonly interface: Interface;
    readonly functions: {
        [name: string]: ContractFunction;
    };
    constructor(addressOrName: string, contractInterface: ContractInterface, signerOrProvider: Signer | Provider);
    static getInterface(contractInterface: ContractInterface): Interface;
}

/**
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */
import { BytesLike } from '@ethersproject/bytes';
import { JsonFragmentType, JsonFragment, ParamType, Fragment, FunctionFragment, EventFragment, Result, Interface as GenernalInterface } from '@ethersproject/abi';
export { JsonFragmentType, JsonFragment, Fragment, FunctionFragment, EventFragment, Result, };
export declare class Interface extends GenernalInterface {
    constructor(fragments: string | Array<Fragment | JsonFragment | string>);
    _formatParams(data: ReadonlyArray<any>, result: (Array<any> & {
        [key: string]: any;
    })): (param: ParamType, index: number) => void;
    decodeFunctionData(functionFragment: FunctionFragment | string, data: BytesLike): Result;
    decodeEventLog(eventFragment: EventFragment | string, data: BytesLike, topics?: Array<string>): Result;
}

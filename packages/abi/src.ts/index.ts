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
 * @file index.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */

'use strict';

import { Logger } from '@ethersproject/logger';
import {
  BytesLike,
} from '@ethersproject/bytes';
import {
  BigNumber,
} from '@ethersproject/bignumber';
import {
  JsonFragmentType,
  JsonFragment,
  ParamType,
  Fragment,
  FunctionFragment,
  EventFragment,
  Result,
  Interface as EthersInterface,
} from '@ethersproject/abi';

const logger = new Logger('abi');

export {
  JsonFragmentType,
  JsonFragment,
  Fragment,
  FunctionFragment,
  EventFragment,
  Result,
};

export class Interface extends EthersInterface {
  constructor(fragments: string | Array<Fragment | JsonFragment | string>) {
    logger.checkNew(new.target, Interface);
    super(fragments);
  }

  protected _formatParamType(data: ReadonlyArray<any>, result: (Array<any> & { [key: string]: any })): (param: ParamType, index: number) => void {
    return (param: ParamType, index: number) => {
      const isAddress = param.type.indexOf('address') === 0;
      const isInt = param.type.indexOf('int') === 0;
      const isUint = param.type.indexOf('uint') === 0;

      if (isAddress) {
        if (Array.isArray(data[index])) {
          result[index] = (<string[]>data[index]).map(address => address.toLowerCase());
        } else {
          result[index] = (<string>data[index]).toLowerCase();
        }
      } else if (isUint || isInt) {
        if (Array.isArray(data[index])) {
          result[index] = data[index].map((number: any) => BigNumber.from(number).toString());
        } else {
          result[index] = BigNumber.from(data[index]).toString();
        }
      } else {
        result[index] = data[index];
      }

      if (param.name && result[param.name] == null) {
        const value = result[index];

        if (value instanceof Error) {
          Object.defineProperty(result, param.name, {
            get: () => { throw new Error(`property ${JSON.stringify(param.name)}: ${value}`) }
          });
        } else {
          result[param.name] = value;
        }
      }
    }
  }

  decodeFunctionData(functionFragment: FunctionFragment | string, data: BytesLike): Result {
    if (typeof (functionFragment) === 'string') {
      functionFragment = this.getFunction(functionFragment);
    }
    const inputs = functionFragment.inputs;
    const functionData = super.decodeFunctionData(functionFragment, data);
    if (inputs.length !== functionData.length) {
      logger.throwError("inputs/values length mismatch", Logger.errors.INVALID_ARGUMENT, {
        count: { types: inputs.length, values: functionData.length },
        value: { types: inputs, values: functionData }
      });
    }

    let result: (Array<any> & { [key: string]: any }) = [];
    inputs.forEach(
      this._formatParamType(functionData, result)
    );

    return result;
  }

  decodeFunctionResult(functionFragment: FunctionFragment | string, data: BytesLike): Result {
    if (typeof (functionFragment) === 'string') {
      functionFragment = this.getFunction(functionFragment);
    }
    const outputs = functionFragment.outputs;
    const functionResult = super.decodeFunctionResult(functionFragment, data);
    if (outputs.length !== functionResult.length) {
      logger.throwError("outputs/values length mismatch", Logger.errors.INVALID_ARGUMENT, {
        count: { types: outputs.length, values: functionResult.length },
        value: { types: outputs, values: functionResult }
      });
    }

    let result: (Array<any> & { [key: string]: any }) = [];
    outputs.forEach(
      this._formatParamType(functionResult, result)
    );

    return result;
  }

  decodeEventLog(eventFragment: EventFragment | string, data: BytesLike, topics?: Array<string>): Result {
    if (typeof (eventFragment) === 'string') {
      eventFragment = this.getEvent(eventFragment);
    }
    const eventLog = super.decodeEventLog(eventFragment, data, topics);
    if (eventFragment.inputs.length !== eventLog.length) {
      logger.throwError("inputs/values length mismatch", Logger.errors.INVALID_ARGUMENT, {
        count: { types: eventFragment.inputs.length, values: eventLog.length },
        value: { types: eventFragment.inputs, values: eventLog }
      });
    }
    let result: (Array<any> & { [key: string]: any }) = [];
    eventFragment.inputs.forEach(
      this._formatParamType(eventLog, result)
    );

    return result;
  }
}

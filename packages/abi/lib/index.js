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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interface = exports.EventFragment = exports.FunctionFragment = exports.Fragment = void 0;
const logger_1 = require("@ethersproject/logger");
const bignumber_1 = require("@ethersproject/bignumber");
const abi_1 = require("@ethersproject/abi");
Object.defineProperty(exports, "Fragment", { enumerable: true, get: function () { return abi_1.Fragment; } });
Object.defineProperty(exports, "FunctionFragment", { enumerable: true, get: function () { return abi_1.FunctionFragment; } });
Object.defineProperty(exports, "EventFragment", { enumerable: true, get: function () { return abi_1.EventFragment; } });
const logger = new logger_1.Logger('abi');
class Interface extends abi_1.Interface {
    constructor(fragments) {
        logger.checkNew(new.target, Interface);
        super(fragments);
    }
    _formatParams(data, result) {
        return (param, index) => {
            const isAddress = param.type.indexOf('address') === 0;
            const isInt = param.type.indexOf('int') === 0;
            const isUint = param.type.indexOf('uint') === 0;
            if (isAddress) {
                if (Array.isArray(data[index])) {
                    result[index] = data[index].map(address => address.toLowerCase());
                }
                else {
                    result[index] = data[index].toLowerCase();
                }
            }
            else if (isUint || isInt) {
                if (Array.isArray(data[index])) {
                    result[index] = data[index].map((number) => bignumber_1.BigNumber.from(number).toString());
                }
                else {
                    result[index] = bignumber_1.BigNumber.from(data[index]).toString();
                }
            }
            else {
                result[index] = data[index];
            }
            if (param.name && result[param.name] == null) {
                const value = result[index];
                if (value instanceof Error) {
                    Object.defineProperty(result, param.name, {
                        get: () => { throw new Error(`property ${JSON.stringify(param.name)}: ${value}`); }
                    });
                }
                else {
                    result[param.name] = value;
                }
            }
        };
    }
    decodeFunctionData(functionFragment, data) {
        if (typeof (functionFragment) === 'string') {
            functionFragment = this.getFunction(functionFragment);
        }
        const functionData = super.decodeFunctionData(functionFragment, data);
        const inputs = functionFragment.inputs;
        if (inputs.length !== functionData.length) {
            logger.throwError("inputs/values length mismatch", logger_1.Logger.errors.INVALID_ARGUMENT, {
                count: { types: inputs.length, values: functionData.length },
                value: { types: inputs, values: functionData }
            });
        }
        let result = [];
        inputs.forEach(this._formatParams(functionData, result));
        return result;
    }
    decodeEventLog(eventFragment, data, topics) {
        if (typeof (eventFragment) === 'string') {
            eventFragment = this.getEvent(eventFragment);
        }
        const eventLog = super.decodeEventLog(eventFragment, data, topics);
        if (eventFragment.inputs.length !== eventLog.length) {
            logger.throwError("inputs/values length mismatch", logger_1.Logger.errors.INVALID_ARGUMENT, {
                count: { types: eventFragment.inputs.length, values: eventLog.length },
                value: { types: eventFragment.inputs, values: eventLog }
            });
        }
        let result = [];
        eventFragment.inputs.forEach(this._formatParams(eventLog, result));
        return result;
    }
}
exports.Interface = Interface;

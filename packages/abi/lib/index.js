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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interface = exports.EventFragment = exports.FunctionFragment = exports.Fragment = void 0;
var logger_1 = require("@ethersproject/logger");
var bignumber_1 = require("@ethersproject/bignumber");
var abi_1 = require("@ethersproject/abi");
Object.defineProperty(exports, "Fragment", { enumerable: true, get: function () { return abi_1.Fragment; } });
Object.defineProperty(exports, "FunctionFragment", { enumerable: true, get: function () { return abi_1.FunctionFragment; } });
Object.defineProperty(exports, "EventFragment", { enumerable: true, get: function () { return abi_1.EventFragment; } });
var logger = new logger_1.Logger('abi');
var Interface = /** @class */ (function (_super) {
    __extends(Interface, _super);
    function Interface(fragments) {
        var _newTarget = this.constructor;
        var _this = this;
        logger.checkNew(_newTarget, Interface);
        _this = _super.call(this, fragments) || this;
        return _this;
    }
    Interface.prototype._formatParamType = function (data, result) {
        return function (param, index) {
            var isAddress = param.type.indexOf('address') === 0;
            var isInt = param.type.indexOf('int') === 0;
            var isUint = param.type.indexOf('uint') === 0;
            if (isAddress) {
                if (Array.isArray(data[index])) {
                    result[index] = data[index].map(function (address) { return address.toLowerCase(); });
                }
                else {
                    result[index] = data[index].toLowerCase();
                }
            }
            else if (isUint || isInt) {
                if (Array.isArray(data[index])) {
                    result[index] = data[index].map(function (number) { return bignumber_1.BigNumber.from(number).toString(); });
                }
                else {
                    result[index] = bignumber_1.BigNumber.from(data[index]).toString();
                }
            }
            else {
                result[index] = data[index];
            }
            if (param.name && result[param.name] == null) {
                var value_1 = result[index];
                if (value_1 instanceof Error) {
                    Object.defineProperty(result, param.name, {
                        get: function () { throw new Error("property " + JSON.stringify(param.name) + ": " + value_1); }
                    });
                }
                else {
                    result[param.name] = value_1;
                }
            }
        };
    };
    Interface.prototype.decodeFunctionData = function (functionFragment, data) {
        if (typeof (functionFragment) === 'string') {
            functionFragment = this.getFunction(functionFragment);
        }
        var inputs = functionFragment.inputs;
        var functionData = _super.prototype.decodeFunctionData.call(this, functionFragment, data);
        if (inputs.length !== functionData.length) {
            logger.throwError("inputs/values length mismatch", logger_1.Logger.errors.INVALID_ARGUMENT, {
                count: { types: inputs.length, values: functionData.length },
                value: { types: inputs, values: functionData }
            });
        }
        var result = [];
        inputs.forEach(this._formatParamType(functionData, result));
        return result;
    };
    Interface.prototype.decodeFunctionResult = function (functionFragment, data) {
        if (typeof (functionFragment) === 'string') {
            functionFragment = this.getFunction(functionFragment);
        }
        var outputs = functionFragment.outputs;
        var functionResult = _super.prototype.decodeFunctionResult.call(this, functionFragment, data);
        if (outputs.length !== functionResult.length) {
            logger.throwError("outputs/values length mismatch", logger_1.Logger.errors.INVALID_ARGUMENT, {
                count: { types: outputs.length, values: functionResult.length },
                value: { types: outputs, values: functionResult }
            });
        }
        var result = [];
        outputs.forEach(this._formatParamType(functionResult, result));
        return result;
    };
    Interface.prototype.decodeEventLog = function (eventFragment, data, topics) {
        if (typeof (eventFragment) === 'string') {
            eventFragment = this.getEvent(eventFragment);
        }
        var eventLog = _super.prototype.decodeEventLog.call(this, eventFragment, data, topics);
        if (eventFragment.inputs.length !== eventLog.length) {
            logger.throwError("inputs/values length mismatch", logger_1.Logger.errors.INVALID_ARGUMENT, {
                count: { types: eventFragment.inputs.length, values: eventLog.length },
                value: { types: eventFragment.inputs, values: eventLog }
            });
        }
        var result = [];
        eventFragment.inputs.forEach(this._formatParamType(eventLog, result));
        return result;
    };
    return Interface;
}(abi_1.Interface));
exports.Interface = Interface;

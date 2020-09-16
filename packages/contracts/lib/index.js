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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
var logger_1 = require("@ethersproject/logger");
var properties_1 = require("@ethersproject/properties");
var abi_1 = require("@crypujs/abi");
var abstract_provider_1 = require("@crypujs/abstract-provider");
var abstract_signer_1 = require("@crypujs/abstract-signer");
var logger = new logger_1.Logger('contracts');
function buildCall(contract, fragment) {
    var _this = this;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var signerOrProvider, tx, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        signerOrProvider = (contract.signer || contract.provider);
                        if (!signerOrProvider) {
                            logger.throwError("sending a transaction requires a signer or provider", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                                operation: "call"
                            });
                        }
                        tx = {
                            to: contract.address,
                            data: contract.interface.encodeFunctionData(fragment, args),
                        };
                        return [4 /*yield*/, signerOrProvider.call(tx)];
                    case 1:
                        result = _a.sent();
                        try {
                            return [2 /*return*/, contract.interface.decodeFunctionResult(fragment, result)];
                        }
                        catch (error) {
                            if (error.code === logger_1.Logger.errors.CALL_EXCEPTION) {
                                error.address = contract.address;
                                error.args = args;
                                error.transaction = tx;
                            }
                            throw error;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
}
function buildSend(contract, fragment) {
    var _this = this;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var signer, tx;
            return __generator(this, function (_a) {
                signer = contract.signer;
                if (!signer) {
                    logger.throwError("sending a transaction requires a signer", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                        operation: "sendTransaction"
                    });
                }
                tx = {
                    to: contract.address,
                    data: contract.interface.encodeFunctionData(fragment, args),
                };
                return [2 /*return*/, signer.sendTransaction(tx)];
            });
        });
    };
}
function buildDefault(contract, fragment) {
    if (fragment.constant) {
        return buildCall(contract, fragment);
    }
    return buildSend(contract, fragment);
}
var Contract = /** @class */ (function () {
    function Contract(addressOrName, contractInterface, signerOrProvider) {
        var _newTarget = this.constructor;
        var _this = this;
        if (signerOrProvider == null) {
            properties_1.defineReadOnly(this, "provider", null);
            properties_1.defineReadOnly(this, "signer", null);
        }
        else if (abstract_signer_1.Signer.isSigner(signerOrProvider)) {
            properties_1.defineReadOnly(this, "provider", signerOrProvider.provider || null);
            properties_1.defineReadOnly(this, "signer", signerOrProvider);
        }
        else if (abstract_provider_1.Provider.isProvider(signerOrProvider)) {
            properties_1.defineReadOnly(this, "provider", signerOrProvider);
            properties_1.defineReadOnly(this, "signer", null);
        }
        properties_1.defineReadOnly(this, 'address', addressOrName);
        properties_1.defineReadOnly(this, 'interface', properties_1.getStatic((_newTarget), 'getInterface')(contractInterface));
        properties_1.defineReadOnly(this, 'functions', {});
        Object.keys(this.interface.functions).forEach(function (signature) {
            var fragment = _this.interface.functions[signature];
            if (_this.functions[fragment.name] == null) {
                properties_1.defineReadOnly(_this.functions, fragment.name, buildDefault(_this, fragment));
            }
        });
    }
    Contract.getInterface = function (contractInterface) {
        if (abi_1.Interface.isInterface(contractInterface)) {
            return contractInterface;
        }
        return new abi_1.Interface(contractInterface);
    };
    return Contract;
}());
exports.Contract = Contract;

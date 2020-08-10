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
exports.verifyMessage = exports.Wallet = void 0;
var logger_1 = require("@ethersproject/logger");
var bytes_1 = require("@ethersproject/bytes");
var keccak256_1 = require("@ethersproject/keccak256");
var properties_1 = require("@ethersproject/properties");
var random_1 = require("@ethersproject/random");
var address_1 = require("@ethersproject/address");
var signing_key_1 = require("@ethersproject/signing-key");
var hash_1 = require("@ethersproject/hash");
var hdnode_1 = require("@ethersproject/hdnode");
var json_wallets_1 = require("@ethersproject/json-wallets");
var transactions_1 = require("@crypujs/transactions");
var abstract_provider_1 = require("@crypujs/abstract-provider");
var abstract_signer_1 = require("@crypujs/abstract-signer");
var signing_escrow_1 = require("@crypujs/signing-escrow");
var logger = new logger_1.Logger('wallet');
function isAccount(value) {
    return (value != null && bytes_1.isHexString(value.privateKey, 32) && value.address != null);
}
function hasMnemonic(value) {
    var mnemonic = value.mnemonic;
    return (mnemonic && mnemonic.phrase);
}
;
var Wallet = /** @class */ (function (_super) {
    __extends(Wallet, _super);
    function Wallet(privateKey, provider) {
        var _newTarget = this.constructor;
        var _this = this;
        logger.checkNew(_newTarget, Wallet);
        _this = _super.call(this) || this;
        if (bytes_1.isBytesLike(privateKey)) {
            var signingKey_1 = new signing_key_1.SigningKey(privateKey);
            properties_1.defineReadOnly(_this, '_signing', function () { return signingKey_1; });
        }
        else if (isAccount(privateKey)) {
            var signingKey_2 = new signing_key_1.SigningKey(privateKey.privateKey);
            properties_1.defineReadOnly(_this, '_signing', function () { return signingKey_2; });
            if (transactions_1.computeAddress(_this.publicKey) !== address_1.getAddress(privateKey.address)) {
                logger.throwArgumentError('privateKey/address mismatch', 'privateKey', '[REDACTED]');
            }
        }
        else if (signing_escrow_1.SigningEscrow.isSigningEscrow(privateKey)) {
            properties_1.defineReadOnly(_this, '_signing', function () { return privateKey; });
        }
        else if (signing_key_1.SigningKey.isSigningKey(privateKey)) {
            if (privateKey.curve !== 'secp256k1') {
                logger.throwArgumentError('unsupported curve; must be secp256k1', 'privateKey', '[REDACTED]');
            }
            properties_1.defineReadOnly(_this, '_signing', function () { return privateKey; });
        }
        properties_1.defineReadOnly(_this, 'address', transactions_1.computeAddress(_this.publicKey));
        if (hasMnemonic(privateKey)) {
            var srcMnemonic_1 = privateKey.mnemonic;
            properties_1.defineReadOnly(_this, '_mnemonic', function () { return ({
                phrase: srcMnemonic_1.phrase,
                path: srcMnemonic_1.path || hdnode_1.defaultPath,
                locale: srcMnemonic_1.locale || 'en'
            }); });
            var mnemonic = _this.mnemonic;
            var node = hdnode_1.HDNode.fromMnemonic(mnemonic.phrase, null, mnemonic.locale).derivePath(mnemonic.path);
            if (transactions_1.computeAddress(node.privateKey) !== _this.address) {
                logger.throwArgumentError('mnemonic/address mismatch', 'privateKey', '[REDACTED]');
            }
        }
        else {
            properties_1.defineReadOnly(_this, '_mnemonic', function () { return null; });
        }
        if (provider && !abstract_provider_1.Provider.isProvider(provider)) {
            logger.throwArgumentError('invalid provider', 'provider', provider);
        }
        properties_1.defineReadOnly(_this, 'provider', provider || null);
        return _this;
    }
    Object.defineProperty(Wallet.prototype, "mnemonic", {
        get: function () { return this._mnemonic(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wallet.prototype, "privateKey", {
        get: function () { return this._signing().privateKey; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wallet.prototype, "publicKey", {
        get: function () { return this._signing().publicKey; },
        enumerable: false,
        configurable: true
    });
    Wallet.prototype.getAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(this.address)];
            });
        });
    };
    Wallet.prototype.signDigest = function (digest) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (signing_key_1.SigningKey.isSigningKey(this._signing)) {
                    return [2 /*return*/, Promise.resolve(this._signing().signDigest(digest))];
                }
                else {
                    return [2 /*return*/, this._signing().signDigest(digest)];
                }
                return [2 /*return*/];
            });
        });
    };
    Wallet.prototype.connect = function (provider) {
        return new Wallet(this, provider);
    };
    Wallet.prototype.signTransaction = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, properties_1.resolveProperties(transaction).then(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                        var signature;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (tx.from != null) {
                                        if (address_1.getAddress(tx.from) !== this.address) {
                                            throw new Error('transaction from address mismatch');
                                        }
                                        delete tx.from;
                                    }
                                    return [4 /*yield*/, this.signDigest(keccak256_1.keccak256(transactions_1.serialize(tx)))];
                                case 1:
                                    signature = _a.sent();
                                    return [2 /*return*/, transactions_1.serialize(tx, signature)];
                            }
                        });
                    }); })];
            });
        });
    };
    Wallet.prototype.signMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = Promise).resolve;
                        _c = bytes_1.joinSignature;
                        return [4 /*yield*/, this.signDigest(hash_1.hashMessage(message))];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.apply(void 0, [_d.sent()])])];
                }
            });
        });
    };
    Wallet.prototype.encrypt = function (password, options, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof (options) === 'function' && !progressCallback) {
                    progressCallback = options;
                    options = {};
                }
                if (progressCallback && typeof (progressCallback) !== 'function') {
                    throw new Error('invalid callback');
                }
                if (!options) {
                    options = {};
                }
                return [2 /*return*/, json_wallets_1.encryptKeystore(this, password, options, progressCallback)];
            });
        });
    };
    /**
     *  Static methods to create Wallet instances.
     */
    Wallet.createRandom = function (options) {
        var entropy = random_1.randomBytes(16);
        if (!options) {
            options = {};
        }
        if (options.extraEntropy) {
            entropy = bytes_1.arrayify(bytes_1.hexDataSlice(keccak256_1.keccak256(bytes_1.concat([entropy, options.extraEntropy])), 0, 16));
        }
        var mnemonic = hdnode_1.entropyToMnemonic(entropy, options.locale);
        return Wallet.fromMnemonic(mnemonic, options.path, options.locale);
    };
    Wallet.fromEncryptedJson = function (json, password, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, json_wallets_1.decryptJsonWallet(json, password, progressCallback).then(function (account) {
                        return new Wallet(account);
                    })];
            });
        });
    };
    Wallet.fromEncryptedJsonSync = function (json, password) {
        return new Wallet(json_wallets_1.decryptJsonWalletSync(json, password));
    };
    Wallet.fromMnemonic = function (mnemonic, path, wordlist) {
        if (!path) {
            path = hdnode_1.defaultPath;
        }
        return new Wallet(hdnode_1.HDNode.fromMnemonic(mnemonic, null, wordlist).derivePath(path));
    };
    return Wallet;
}(abstract_signer_1.Signer));
exports.Wallet = Wallet;
function verifyMessage(message, signature) {
    return transactions_1.recoverAddress(hash_1.hashMessage(message), signature);
}
exports.verifyMessage = verifyMessage;

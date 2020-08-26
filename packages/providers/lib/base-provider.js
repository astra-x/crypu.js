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
 * @file base-provider.ts
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
exports.BaseProvider = exports.Event = void 0;
var logger_1 = require("@ethersproject/logger");
var bytes_1 = require("@ethersproject/bytes");
var networks_1 = require("@ethersproject/networks");
var properties_1 = require("@ethersproject/properties");
var bignumber_1 = require("@ethersproject/bignumber");
var strings_1 = require("@ethersproject/strings");
var hash_1 = require("@ethersproject/hash");
var web_1 = require("@crypujs/web");
var abstract_provider_1 = require("@crypujs/abstract-provider");
var formatter_1 = require("./formatter");
var logger = new logger_1.Logger('providers');
//////////////////////////////
// Event Serializeing
function checkTopic(topic) {
    if (topic == null) {
        return 'null';
    }
    if (bytes_1.hexDataLength(topic) !== 32) {
        logger.throwArgumentError('invalid topic', 'topic', topic);
    }
    return topic.toLowerCase();
}
function serializeTopics(topics) {
    // Remove trailing null AND-topics; they are redundant
    topics = topics.slice();
    while (topics.length > 0 && topics[topics.length - 1] == null) {
        topics.pop();
    }
    return topics.map(function (topic) {
        if (Array.isArray(topic)) {
            // Only track unique OR-topics
            var unique_1 = {};
            topic.forEach(function (topic) {
                unique_1[checkTopic(topic)] = true;
            });
            // The order of OR-topics does not matter
            var sorted = Object.keys(unique_1);
            sorted.sort();
            return sorted.join('|');
        }
        else {
            return checkTopic(topic);
        }
    }).join('&');
}
function deserializeTopics(data) {
    if (data === '') {
        return [];
    }
    return data.split(/&/g).map(function (topic) {
        if (topic === '') {
            return [];
        }
        var comps = topic.split('|').map(function (topic) {
            return ((topic === 'null') ? null : topic);
        });
        return ((comps.length === 1) ? comps[0] : comps);
    });
}
function getEventTag(eventName) {
    if (typeof (eventName) === 'string') {
        eventName = eventName.toLowerCase();
        if (bytes_1.hexDataLength(eventName) === 32) {
            return 'tx:' + eventName;
        }
        if (eventName.indexOf(':') === -1) {
            return eventName;
        }
    }
    else if (Array.isArray(eventName)) {
        return 'filter:*:' + serializeTopics(eventName);
    }
    else if (abstract_provider_1.ForkEvent.isForkEvent(eventName)) {
        logger.warn('not implemented');
        throw new Error('not implemented');
    }
    else if (eventName && typeof (eventName) === 'object') {
        return 'filter:' + (eventName.address || '*') + ':' + serializeTopics(eventName.topics || []);
    }
    throw new Error('invalid event - ' + eventName);
}
//////////////////////////////
// Helper Object
function getTime() {
    return (new Date()).getTime();
}
function stall(duration) {
    return new Promise(function (resolve) {
        setTimeout(resolve, duration);
    });
}
//////////////////////////////
// Provider Object
/**
 *  EventType
 *   - 'block'
 *   - 'poll'
 *   - 'didPoll'
 *   - 'pending'
 *   - 'error'
 *   - 'network'
 *   - filter
 *   - topics array
 *   - transaction hash
 */
var PollableEvents = ['block', 'network', 'pending', 'poll'];
var Event = /** @class */ (function () {
    function Event(tag, listener, once) {
        properties_1.defineReadOnly(this, 'tag', tag);
        properties_1.defineReadOnly(this, 'listener', listener);
        properties_1.defineReadOnly(this, 'once', once);
    }
    Object.defineProperty(Event.prototype, "event", {
        get: function () {
            switch (this.type) {
                case 'tx':
                    return this.hash;
                case 'filter':
                    return this.filter;
            }
            return this.tag;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "type", {
        get: function () {
            return this.tag.split(':')[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "hash", {
        get: function () {
            var comps = this.tag.split(':');
            if (comps[0] !== 'tx') {
                return null;
            }
            return comps[1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "filter", {
        get: function () {
            var comps = this.tag.split(':');
            if (comps[0] !== 'filter') {
                return null;
            }
            var address = comps[1];
            var topics = deserializeTopics(comps[2]);
            var filter = {};
            if (topics.length > 0) {
                filter.topics = topics;
            }
            if (address && address !== '*') {
                filter.address = address;
            }
            return filter;
        },
        enumerable: false,
        configurable: true
    });
    Event.prototype.pollable = function () {
        return (this.tag.indexOf(':') >= 0 || PollableEvents.indexOf(this.tag) >= 0);
    };
    return Event;
}());
exports.Event = Event;
var defaultFormatter = null;
var nextPollId = 1;
var BaseProvider = /** @class */ (function (_super) {
    __extends(BaseProvider, _super);
    /**
     *  ready
     *
     *  A Promise<Network> that resolves only once the provider is ready.
     *
     *  Sub-classes that call the super with a network without a chainId
     *  MUST set this. Standard named networks have a known chainId.
     *
     */
    function BaseProvider(network, groupId) {
        var _newTarget = this.constructor;
        var _this = this;
        logger.checkNew(_newTarget, abstract_provider_1.Provider);
        _this = _super.call(this) || this;
        // Events being listened to
        _this._events = [];
        _this._emitted = { block: -2 };
        _this.formatter = _newTarget.getFormatter();
        // If network is any, this Provider allows the underlying
        // network to change dynamically, and we auto-detect the
        // current network
        properties_1.defineReadOnly(_this, 'anyNetwork', (network === 'any'));
        if (_this.anyNetwork) {
            network = _this.detectNetwork();
        }
        if (network instanceof Promise) {
            _this._networkPromise = network;
            // Squash any 'unhandled promise' errors; that do not need to be handled
            network.catch(function (_) { });
            // Trigger initial network setting (async)
            _this._ready().catch(function (_) { });
        }
        else {
            var knownNetwork = properties_1.getStatic((_newTarget), 'getNetwork')(network);
            if (knownNetwork) {
                properties_1.defineReadOnly(_this, '_network', knownNetwork);
                _this.emit('network', knownNetwork, null);
            }
            else {
                logger.throwArgumentError('invalid network', 'network', network);
            }
        }
        _this._groupId = groupId;
        _this._maxInternalBlockNumber = -1024;
        _this._lastBlockNumber = -2;
        _this._pollingInterval = 4000;
        _this._fastQueryDate = 0;
        return _this;
    }
    BaseProvider.prototype._ready = function () {
        return __awaiter(this, void 0, void 0, function () {
            var network, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._network == null)) return [3 /*break*/, 7];
                        network = null;
                        if (!this._networkPromise) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._networkPromise];
                    case 2:
                        network = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        if (!(network == null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.detectNetwork()];
                    case 5:
                        network = _a.sent();
                        _a.label = 6;
                    case 6:
                        // This should never happen; every Provider sub-class should have
                        // suggested a network by here (or have thrown).
                        if (!network) {
                            logger.throwError('no network detected', logger_1.Logger.errors.UNKNOWN_ERROR, {});
                        }
                        // Possible this call stacked so do not call defineReadOnly again
                        if (this._network == null) {
                            if (this.anyNetwork) {
                                this._network = network;
                            }
                            else {
                                properties_1.defineReadOnly(this, '_network', network);
                            }
                            this.emit('network', network, null);
                        }
                        _a.label = 7;
                    case 7: return [2 /*return*/, this._network];
                }
            });
        });
    };
    Object.defineProperty(BaseProvider.prototype, "ready", {
        // This will always return the most recently established network.
        // For 'any', this can change (a 'network' event is emitted before
        // any change is refelcted); otherwise this cannot change
        get: function () {
            var _this = this;
            return web_1.poll(function () {
                return _this._ready().then(function (network) {
                    return network;
                }, function (error) {
                    // If the network isn't running yet, we will wait
                    if (error.code === logger_1.Logger.errors.NETWORK_ERROR && error.event === 'noNetwork') {
                        return undefined;
                    }
                    throw error;
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    // @TODO: Remove this and just create a singleton formatter
    BaseProvider.getFormatter = function () {
        if (defaultFormatter == null) {
            defaultFormatter = new formatter_1.Formatter();
        }
        return defaultFormatter;
    };
    // @TODO: Remove this and just use getNetwork
    BaseProvider.getNetwork = function (network) {
        return networks_1.getNetwork((network == null) ? 'homestead' : network);
    };
    // Fetches the blockNumber, but will reuse any result that is less
    // than maxAge old or has been requested since the last request
    BaseProvider.prototype._getInternalBlockNumber = function (maxAge) {
        return __awaiter(this, void 0, void 0, function () {
            var internalBlockNumber, result, reqTime, checkInternalBlockNumber;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ready()];
                    case 1:
                        _a.sent();
                        internalBlockNumber = this._internalBlockNumber;
                        if (!(maxAge > 0 && this._internalBlockNumber)) return [3 /*break*/, 3];
                        return [4 /*yield*/, internalBlockNumber];
                    case 2:
                        result = _a.sent();
                        if ((getTime() - result.respTime) <= maxAge) {
                            return [2 /*return*/, result.blockNumber];
                        }
                        _a.label = 3;
                    case 3:
                        reqTime = getTime();
                        checkInternalBlockNumber = properties_1.resolveProperties({
                            blockNumber: this.perform('getBlockNumber', {}),
                            networkError: this.getNetwork().then(function (_) { return (null); }, function (error) { return (error); })
                        }).then(function (_a) {
                            var blockNumber = _a.blockNumber, networkError = _a.networkError;
                            if (networkError) {
                                // Unremember this bad internal block number
                                if (_this._internalBlockNumber === checkInternalBlockNumber) {
                                    _this._internalBlockNumber = null;
                                }
                                throw networkError;
                            }
                            var respTime = getTime();
                            blockNumber = bignumber_1.BigNumber.from(blockNumber).toNumber();
                            if (blockNumber < _this._maxInternalBlockNumber) {
                                blockNumber = _this._maxInternalBlockNumber;
                            }
                            _this._maxInternalBlockNumber = blockNumber;
                            _this._setFastBlockNumber(blockNumber); // @TODO: Still need this?
                            return { blockNumber: blockNumber, reqTime: reqTime, respTime: respTime };
                        });
                        this._internalBlockNumber = checkInternalBlockNumber;
                        return [4 /*yield*/, checkInternalBlockNumber];
                    case 4: return [2 /*return*/, (_a.sent()).blockNumber];
                }
            });
        });
    };
    BaseProvider.prototype.poll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pollId, runners, blockNumber, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pollId = nextPollId++;
                        runners = [];
                        return [4 /*yield*/, this._getInternalBlockNumber(100 + this.pollingInterval / 2)];
                    case 1:
                        blockNumber = _a.sent();
                        this._setFastBlockNumber(blockNumber);
                        // Emit a poll event after we have the latest (fast) block number
                        this.emit('poll', pollId, blockNumber);
                        // If the block has not changed, meh.
                        if (blockNumber === this._lastBlockNumber) {
                            this.emit('didPoll', pollId);
                            return [2 /*return*/];
                        }
                        // First polling cycle, trigger a 'block' events
                        if (this._emitted.block === -2) {
                            this._emitted.block = blockNumber - 1;
                        }
                        if (Math.abs((this._emitted.block) - blockNumber) > 1000) {
                            logger.warn('network block skew detected; skipping block events');
                            this.emit('error', logger.makeError('network block skew detected', logger_1.Logger.errors.NETWORK_ERROR, {
                                blockNumber: blockNumber,
                                event: 'blockSkew',
                                previousBlockNumber: this._emitted.block
                            }));
                            this.emit('block', blockNumber);
                        }
                        else {
                            // Notify all listener for each block that has passed
                            for (i = this._emitted.block + 1; i <= blockNumber; i++) {
                                this.emit('block', i);
                            }
                        }
                        // The emitted block was updated, check for obsolete events
                        if (this._emitted.block !== blockNumber) {
                            this._emitted.block = blockNumber;
                            Object.keys(this._emitted).forEach(function (key) {
                                // The block event does not expire
                                if (key === 'block') {
                                    return;
                                }
                                // The block we were at when we emitted this event
                                var eventBlockNumber = _this._emitted[key];
                                // We cannot garbage collect pending transactions or blocks here
                                // They should be garbage collected by the Provider when setting
                                // 'pending' events
                                if (eventBlockNumber === 'pending') {
                                    return;
                                }
                                // Evict any transaction hashes or block hashes over 12 blocks
                                // old, since they should not return null anyways
                                if (blockNumber - eventBlockNumber > 12) {
                                    delete _this._emitted[key];
                                }
                            });
                        }
                        // First polling cycle
                        if (this._lastBlockNumber === -2) {
                            this._lastBlockNumber = blockNumber - 1;
                        }
                        // Find all transaction hashes we are waiting on
                        this._events.forEach(function (event) {
                            switch (event.type) {
                                case 'tx': {
                                    var hash_2 = event.hash;
                                    var runner = _this.getTransactionReceipt(hash_2).then(function (receipt) {
                                        if (!receipt || receipt.blockNumber == null) {
                                            return null;
                                        }
                                        _this._emitted['t:' + hash_2] = receipt.blockNumber;
                                        _this.emit(hash_2, receipt);
                                        return null;
                                    }).catch(function (error) { _this.emit('error', error); });
                                    runners.push(runner);
                                    break;
                                }
                                case 'filter': {
                                    var filter_1 = event.filter;
                                    filter_1.fromBlock = _this._lastBlockNumber + 1;
                                    filter_1.toBlock = blockNumber;
                                    var runner = _this.getLogs(filter_1).then(function (logs) {
                                        if (logs.length === 0) {
                                            return;
                                        }
                                        logs.forEach(function (log) {
                                            _this._emitted['b:' + log.blockHash] = log.blockNumber;
                                            _this._emitted['t:' + log.transactionHash] = log.blockNumber;
                                            _this.emit(filter_1, log);
                                        });
                                    }).catch(function (error) { _this.emit('error', error); });
                                    runners.push(runner);
                                    break;
                                }
                            }
                        });
                        this._lastBlockNumber = blockNumber;
                        // Once all events for this loop have been processed, emit 'didPoll'
                        Promise.all(runners).then(function () {
                            _this.emit('didPoll', pollId);
                        });
                        return [2 /*return*/, null];
                }
            });
        });
    };
    // Deprecated; do not use this
    BaseProvider.prototype.resetEventsBlock = function (blockNumber) {
        this._lastBlockNumber = blockNumber - 1;
        if (this.polling) {
            this.poll();
        }
    };
    Object.defineProperty(BaseProvider.prototype, "network", {
        get: function () {
            return this._network;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseProvider.prototype, "groupId", {
        get: function () {
            return this._groupId;
        },
        enumerable: false,
        configurable: true
    });
    // This method should query the network if the underlying network
    // can change, such as when connected to a JSON-RPC backend
    BaseProvider.prototype.detectNetwork = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, logger.throwError('provider does not support network detection', logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                        operation: 'provider.detectNetwork'
                    })];
            });
        });
    };
    BaseProvider.prototype.getNetwork = function () {
        return __awaiter(this, void 0, void 0, function () {
            var network, currentNetwork, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ready()];
                    case 1:
                        network = _a.sent();
                        return [4 /*yield*/, this.detectNetwork()];
                    case 2:
                        currentNetwork = _a.sent();
                        if (!(network.chainId !== currentNetwork.chainId)) return [3 /*break*/, 5];
                        if (!this.anyNetwork) return [3 /*break*/, 4];
                        this._network = currentNetwork;
                        // Reset all internal block number guards and caches
                        this._lastBlockNumber = -2;
                        this._fastBlockNumber = null;
                        this._fastBlockNumberPromise = null;
                        this._fastQueryDate = 0;
                        this._emitted.block = -2;
                        this._maxInternalBlockNumber = -1024;
                        this._internalBlockNumber = null;
                        // The 'network' event MUST happen before this method resolves
                        // so any events have a chance to unregister, so we stall an
                        // additional event loop before returning from /this/ call
                        this.emit('network', currentNetwork, network);
                        return [4 /*yield*/, stall(0)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this._network];
                    case 4:
                        error = logger.makeError('underlying network changed', logger_1.Logger.errors.NETWORK_ERROR, {
                            event: 'changed',
                            network: network,
                            detectedNetwork: currentNetwork
                        });
                        this.emit('error', error);
                        throw error;
                    case 5: return [2 /*return*/, network];
                }
            });
        });
    };
    BaseProvider.prototype.getGroupId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.groupId];
            });
        });
    };
    Object.defineProperty(BaseProvider.prototype, "blockNumber", {
        get: function () {
            var _this = this;
            this._getInternalBlockNumber(100 + this.pollingInterval / 2).then(function (blockNumber) {
                _this._setFastBlockNumber(blockNumber);
            });
            return (this._fastBlockNumber != null) ? this._fastBlockNumber : -1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseProvider.prototype, "polling", {
        get: function () {
            return (this._poller != null);
        },
        set: function (value) {
            var _this = this;
            if (value && !this._poller) {
                this._poller = setInterval(this.poll.bind(this), this.pollingInterval);
                if (!this._bootstrapPoll) {
                    this._bootstrapPoll = setTimeout(function () {
                        _this.poll();
                        // We block additional polls until the polling interval
                        // is done, to prevent overwhelming the poll function
                        _this._bootstrapPoll = setTimeout(function () {
                            // If polling was disabled, something may require a poke
                            // since starting the bootstrap poll and it was disabled
                            if (!_this._poller) {
                                _this.poll();
                            }
                            // Clear out the bootstrap so we can do another
                            _this._bootstrapPoll = null;
                        }, _this.pollingInterval);
                    }, 0);
                }
            }
            else if (!value && this._poller) {
                clearInterval(this._poller);
                this._poller = null;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseProvider.prototype, "pollingInterval", {
        get: function () {
            return this._pollingInterval;
        },
        set: function (value) {
            var _this = this;
            if (typeof (value) !== 'number' || value <= 0 || parseInt(String(value)) != value) {
                throw new Error('invalid polling interval');
            }
            this._pollingInterval = value;
            if (this._poller) {
                clearInterval(this._poller);
                this._poller = setInterval(function () { _this.poll(); }, this._pollingInterval);
            }
        },
        enumerable: false,
        configurable: true
    });
    BaseProvider.prototype._getFastBlockNumber = function () {
        var _this = this;
        var now = getTime();
        // Stale block number, request a newer value
        if ((now - this._fastQueryDate) > 2 * this._pollingInterval) {
            this._fastQueryDate = now;
            this._fastBlockNumberPromise = this.getBlockNumber().then(function (blockNumber) {
                if (_this._fastBlockNumber == null || blockNumber > _this._fastBlockNumber) {
                    _this._fastBlockNumber = blockNumber;
                }
                return _this._fastBlockNumber;
            });
        }
        return this._fastBlockNumberPromise;
    };
    BaseProvider.prototype._setFastBlockNumber = function (blockNumber) {
        // Older block, maybe a stale request
        if (this._fastBlockNumber != null && blockNumber < this._fastBlockNumber) {
            return;
        }
        // Update the time we updated the blocknumber
        this._fastQueryDate = getTime();
        // Newer block number, use  it
        if (this._fastBlockNumber == null || blockNumber > this._fastBlockNumber) {
            this._fastBlockNumber = blockNumber;
            this._fastBlockNumberPromise = Promise.resolve(blockNumber);
        }
    };
    BaseProvider.prototype.waitForTransaction = function (transactionHash, confirmations, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var receipt;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (confirmations == null) {
                            confirmations = 1;
                        }
                        return [4 /*yield*/, this.getTransactionReceipt(transactionHash)];
                    case 1:
                        receipt = _a.sent();
                        // Receipt is already good
                        if ((receipt ? receipt.confirmations : 0) >= confirmations) {
                            return [2 /*return*/, receipt];
                        }
                        // Poll until the receipt is good...
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var timer = null;
                                var done = false;
                                var handler = function (receipt) {
                                    if (receipt.confirmations < confirmations) {
                                        return;
                                    }
                                    if (timer) {
                                        clearTimeout(timer);
                                    }
                                    if (done) {
                                        return;
                                    }
                                    done = true;
                                    _this.removeListener(transactionHash, handler);
                                    resolve(receipt);
                                };
                                _this.on(transactionHash, handler);
                                if (typeof (timeout) === 'number' && timeout > 0) {
                                    timer = setTimeout(function () {
                                        if (done) {
                                            return;
                                        }
                                        timer = null;
                                        done = true;
                                        _this.removeListener(transactionHash, handler);
                                        reject(logger.makeError('timeout exceeded', logger_1.Logger.errors.TIMEOUT, { timeout: timeout }));
                                    }, timeout);
                                    if (timer.unref) {
                                        timer.unref();
                                    }
                                }
                            })];
                }
            });
        });
    };
    BaseProvider.prototype.getBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._getInternalBlockNumber(0)];
            });
        });
    };
    BaseProvider.prototype.getGasPrice = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, bignumber_1.BigNumber.from(300000000)];
                }
            });
        });
    };
    BaseProvider.prototype.getClientVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.perform('getClientVersion', [])];
                }
            });
        });
    };
    BaseProvider.prototype.getPbftView = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.perform('getPbftView', [])];
                }
            });
        });
    };
    BaseProvider.prototype.getSealerList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.perform('getSealerList', [])];
                }
            });
        });
    };
    BaseProvider.prototype.getObserverList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.perform('getObserverList', [])];
                }
            });
        });
    };
    BaseProvider.prototype.getSyncStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.perform('getSyncStatus', [])];
                }
            });
        });
    };
    BaseProvider.prototype.getPeers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.perform('getPeers', [])];
                }
            });
        });
    };
    BaseProvider.prototype.getNodeIdList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.perform('getNodeIdList', [])];
                }
            });
        });
    };
    BaseProvider.prototype.getGroupList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.perform('getGroupList', [])];
                }
            });
        });
    };
    BaseProvider.prototype.getBalance = function (addressOrName, blockTag) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, properties_1.resolveProperties({
                                address: this._getAddress(addressOrName),
                                blockTag: this._getBlockTag(blockTag)
                            })];
                    case 2:
                        params = _c.sent();
                        _b = (_a = bignumber_1.BigNumber).from;
                        return [4 /*yield*/, this.perform('getBalance', params)];
                    case 3: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    BaseProvider.prototype.getTransactionCount = function (addressOrName, blockTag) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, properties_1.resolveProperties({
                                address: this._getAddress(addressOrName),
                                blockTag: this._getBlockTag(blockTag)
                            })];
                    case 2:
                        params = _c.sent();
                        _b = (_a = bignumber_1.BigNumber).from;
                        return [4 /*yield*/, this.perform('getTransactionCount', params)];
                    case 3: return [2 /*return*/, _b.apply(_a, [_c.sent()]).toNumber()];
                }
            });
        });
    };
    BaseProvider.prototype.getCode = function (addressOrName, blockTag) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, properties_1.resolveProperties({
                                address: this._getAddress(addressOrName),
                                blockTag: this._getBlockTag(blockTag)
                            })];
                    case 2:
                        params = _b.sent();
                        _a = bytes_1.hexlify;
                        return [4 /*yield*/, this.perform('getCode', params)];
                    case 3: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    // This should be called by any subclass wrapping a TransactionResponse
    BaseProvider.prototype._wrapTransaction = function (tx, hash) {
        var _this = this;
        if (hash != null && bytes_1.hexDataLength(hash) !== 32) {
            throw new Error('invalid response - sendTransaction');
        }
        var result = tx;
        // Check the hash we expect is the same as the hash the server reported
        if (hash != null && tx.hash !== hash) {
            logger.throwError('Transaction hash mismatch from Provider.sendTransaction.', logger_1.Logger.errors.UNKNOWN_ERROR, { expectedHash: tx.hash, returnedHash: hash });
        }
        // @TODO: (confirmations? number, timeout? number)
        result.wait = function (confirmations) { return __awaiter(_this, void 0, void 0, function () {
            var receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // We know this transaction *must* exist (whether it gets mined is
                        // another story), so setting an emitted value forces us to
                        // wait even if the node returns null for the receipt
                        if (confirmations !== 0) {
                            this._emitted['t:' + tx.hash] = 'pending';
                        }
                        return [4 /*yield*/, this.waitForTransaction(tx.hash, confirmations)];
                    case 1:
                        receipt = _a.sent();
                        if (receipt == null && confirmations === 0) {
                            return [2 /*return*/, null];
                        }
                        // No longer pending, allow the polling loop to garbage collect this
                        this._emitted['t:' + tx.hash] = receipt.blockNumber;
                        return [2 /*return*/, receipt];
                }
            });
        }); };
        return result;
    };
    BaseProvider.prototype.sendTransaction = function (signedTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var hexTx, tx, hash, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Promise.resolve(signedTransaction).then(function (t) { return bytes_1.hexlify(t); })];
                    case 2:
                        hexTx = _a.sent();
                        tx = this.formatter.transaction(signedTransaction);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.perform('sendTransaction', { signedTransaction: hexTx })];
                    case 4:
                        hash = _a.sent();
                        return [2 /*return*/, this._wrapTransaction(tx, hash)];
                    case 5:
                        error_2 = _a.sent();
                        error_2.transaction = tx;
                        error_2.transactionHash = tx.hash;
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BaseProvider.prototype._getTransactionRequest = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var values, tx, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        values = transaction;
                        tx = {};
                        ['from', 'to'].forEach(function (key) {
                            if (values[key] == null) {
                                return;
                            }
                            tx[key] = Promise.resolve(values[key]).then(function (v) { return (v ? _this._getAddress(v) : null); });
                        });
                        ['gasLimit', 'gasPrice', 'value'].forEach(function (key) {
                            if (values[key] == null) {
                                return;
                            }
                            tx[key] = Promise.resolve(values[key]).then(function (v) { return (v ? bignumber_1.BigNumber.from(v) : null); });
                        });
                        ['data'].forEach(function (key) {
                            if (values[key] == null) {
                                return;
                            }
                            tx[key] = Promise.resolve(values[key]).then(function (v) { return (v ? bytes_1.hexlify(v) : null); });
                        });
                        _b = (_a = this.formatter).transactionRequest;
                        return [4 /*yield*/, properties_1.resolveProperties(tx)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    BaseProvider.prototype._getFilter = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, filter];
                    case 1:
                        filter = _c.sent();
                        result = {};
                        if (filter.address != null) {
                            result.address = this._getAddress(filter.address);
                        }
                        ['blockHash', 'topics'].forEach(function (key) {
                            if (filter[key] == null) {
                                return;
                            }
                            result[key] = filter[key];
                        });
                        ['fromBlock', 'toBlock'].forEach(function (key) {
                            if (filter[key] == null) {
                                return;
                            }
                            result[key] = _this._getBlockTag(filter[key]);
                        });
                        _b = (_a = this.formatter).filter;
                        return [4 /*yield*/, properties_1.resolveProperties(result)];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    BaseProvider.prototype.call = function (transaction, blockTag) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, properties_1.resolveProperties({
                                transaction: this._getTransactionRequest(transaction),
                                blockTag: this._getBlockTag(blockTag)
                            })];
                    case 2:
                        params = _b.sent();
                        _a = bytes_1.hexlify;
                        return [4 /*yield*/, this.perform('call', params)];
                    case 3: return [2 /*return*/, _a.apply(void 0, [(_b.sent()).output])];
                }
            });
        });
    };
    BaseProvider.prototype.estimateGas = function (_) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, bignumber_1.BigNumber.from(1000000)];
            });
        });
    };
    BaseProvider.prototype._getAddress = function (addressOrName) {
        return __awaiter(this, void 0, void 0, function () {
            var address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolveName(addressOrName)];
                    case 1:
                        address = _a.sent();
                        if (address == null) {
                            logger.throwError('ENS name not configured', logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                                operation: "resolveName(" + JSON.stringify(addressOrName) + ")"
                            });
                        }
                        return [2 /*return*/, address];
                }
            });
        });
    };
    BaseProvider.prototype._getBlock = function (blockHashOrBlockTag, includeTransactions) {
        return __awaiter(this, void 0, void 0, function () {
            var blockNumber, params, _a, _b, _c, error_3;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, blockHashOrBlockTag];
                    case 2:
                        blockHashOrBlockTag = _d.sent();
                        blockNumber = -128;
                        params = {
                            includeTransactions: !!includeTransactions
                        };
                        if (!bytes_1.isHexString(blockHashOrBlockTag, 32)) return [3 /*break*/, 3];
                        params.blockHash = blockHashOrBlockTag;
                        return [3 /*break*/, 6];
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        _a = params;
                        _c = (_b = this.formatter).blockTag;
                        return [4 /*yield*/, this._getBlockTag(blockHashOrBlockTag)];
                    case 4:
                        _a.blockTag = _c.apply(_b, [_d.sent()]);
                        if (bytes_1.isHexString(params.blockTag)) {
                            blockNumber = parseInt(params.blockTag.substring(2), 16);
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _d.sent();
                        logger.throwArgumentError('invalid block hash or block tag', 'blockHashOrBlockTag', blockHashOrBlockTag);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, web_1.poll(function () { return __awaiter(_this, void 0, void 0, function () {
                            var block, blockNumber_1, i, tx, confirmations;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.perform('getBlock', params)];
                                    case 1:
                                        block = _a.sent();
                                        // Block was not found
                                        if (block == null) {
                                            // For blockhashes, if we didn't say it existed, that blockhash may
                                            // not exist. If we did see it though, perhaps from a log, we know
                                            // it exists, and this node is just not caught up yet.
                                            if (params.blockHash != null) {
                                                if (this._emitted['b:' + params.blockHash] == null) {
                                                    return [2 /*return*/, null];
                                                }
                                            }
                                            // For block tags, if we are asking for a future block, we return null
                                            if (params.blockTag != null) {
                                                if (blockNumber > this._emitted.block) {
                                                    return [2 /*return*/, null];
                                                }
                                            }
                                            // Retry on the next block
                                            return [2 /*return*/, undefined];
                                        }
                                        if (!includeTransactions) return [3 /*break*/, 8];
                                        blockNumber_1 = null;
                                        i = 0;
                                        _a.label = 2;
                                    case 2:
                                        if (!(i < block.transactions.length)) return [3 /*break*/, 7];
                                        tx = block.transactions[i];
                                        if (!(tx.blockNumber == null)) return [3 /*break*/, 3];
                                        tx.confirmations = 0;
                                        return [3 /*break*/, 6];
                                    case 3:
                                        if (!(tx.confirmations == null)) return [3 /*break*/, 6];
                                        if (!(blockNumber_1 == null)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
                                    case 4:
                                        blockNumber_1 = _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        confirmations = (blockNumber_1 - tx.blockNumber) + 1;
                                        if (confirmations <= 0) {
                                            confirmations = 1;
                                        }
                                        tx.confirmations = confirmations;
                                        _a.label = 6;
                                    case 6:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 7: return [2 /*return*/, this.formatter.blockWithTransactions(block)];
                                    case 8: return [2 /*return*/, this.formatter.block(block)];
                                }
                            });
                        }); }, { oncePoll: this })];
                }
            });
        });
    };
    BaseProvider.prototype.getBlock = function (blockHashOrBlockTag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (this._getBlock(blockHashOrBlockTag, false))];
            });
        });
    };
    BaseProvider.prototype.getBlockWithTransactions = function (blockHashOrBlockTag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (this._getBlock(blockHashOrBlockTag, true))];
            });
        });
    };
    BaseProvider.prototype.getTransaction = function (transactionHash) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, transactionHash];
                    case 2:
                        transactionHash = _a.sent();
                        params = { transactionHash: this.formatter.hash(transactionHash, true) };
                        return [2 /*return*/, web_1.poll(function () { return __awaiter(_this, void 0, void 0, function () {
                                var result, tx, blockNumber, confirmations;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.perform('getTransaction', params)];
                                        case 1:
                                            result = _a.sent();
                                            if (result == null) {
                                                if (this._emitted['t:' + transactionHash] == null) {
                                                    return [2 /*return*/, null];
                                                }
                                                return [2 /*return*/, undefined];
                                            }
                                            tx = this.formatter.transactionResponse(result);
                                            if (!(tx.blockNumber == null)) return [3 /*break*/, 2];
                                            tx.confirmations = 0;
                                            return [3 /*break*/, 4];
                                        case 2:
                                            if (!(tx.confirmations == null)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
                                        case 3:
                                            blockNumber = _a.sent();
                                            confirmations = (blockNumber - tx.blockNumber) + 1;
                                            if (confirmations <= 0) {
                                                confirmations = 1;
                                            }
                                            tx.confirmations = confirmations;
                                            _a.label = 4;
                                        case 4: return [2 /*return*/, this._wrapTransaction(tx)];
                                    }
                                });
                            }); }, { oncePoll: this })];
                }
            });
        });
    };
    BaseProvider.prototype.getTransactionReceipt = function (transactionHash) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, transactionHash];
                    case 2:
                        transactionHash = _a.sent();
                        params = { transactionHash: this.formatter.hash(transactionHash, true) };
                        return [2 /*return*/, web_1.poll(function () { return __awaiter(_this, void 0, void 0, function () {
                                var result, receipt, blockNumber, confirmations;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.perform('getTransactionReceipt', params)];
                                        case 1:
                                            result = _a.sent();
                                            if (result == null) {
                                                if (this._emitted['t:' + transactionHash] == null) {
                                                    return [2 /*return*/, null];
                                                }
                                                return [2 /*return*/, undefined];
                                            }
                                            // 'geth-etc' returns receipts before they are ready
                                            if (result.blockHash == null) {
                                                return [2 /*return*/, undefined];
                                            }
                                            receipt = this.formatter.receipt(result);
                                            if (!(receipt.blockNumber == null)) return [3 /*break*/, 2];
                                            receipt.confirmations = 0;
                                            return [3 /*break*/, 4];
                                        case 2:
                                            if (!(receipt.confirmations == null)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
                                        case 3:
                                            blockNumber = _a.sent();
                                            confirmations = (blockNumber - receipt.blockNumber) + 1;
                                            if (confirmations <= 0) {
                                                confirmations = 1;
                                            }
                                            receipt.confirmations = confirmations;
                                            _a.label = 4;
                                        case 4: return [2 /*return*/, receipt];
                                    }
                                });
                            }); }, { oncePoll: this })];
                }
            });
        });
    };
    BaseProvider.prototype.getLogs = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var params, logs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, properties_1.resolveProperties({ filter: this._getFilter(filter) })];
                    case 2:
                        params = _a.sent();
                        return [4 /*yield*/, this.perform('getLogs', params)];
                    case 3:
                        logs = _a.sent();
                        logs.forEach(function (log) {
                            if (log.removed == null) {
                                log.removed = false;
                            }
                        });
                        return [2 /*return*/, formatter_1.Formatter.arrayOf(this.formatter.filterLog.bind(this.formatter))(logs)];
                }
            });
        });
    };
    BaseProvider.prototype.getEtherPrice = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.perform('getEtherPrice', {})];
                }
            });
        });
    };
    BaseProvider.prototype._getBlockTag = function (blockTag) {
        return __awaiter(this, void 0, void 0, function () {
            var blockNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blockTag];
                    case 1:
                        blockTag = _a.sent();
                        if (!(typeof (blockTag) === 'number' && blockTag < 0)) return [3 /*break*/, 3];
                        if (blockTag % 1) {
                            logger.throwArgumentError('invalid BlockTag', 'blockTag', blockTag);
                        }
                        return [4 /*yield*/, this._getInternalBlockNumber(100 + 2 * this.pollingInterval)];
                    case 2:
                        blockNumber = _a.sent();
                        blockNumber += blockTag;
                        if (blockNumber < 0) {
                            blockNumber = 0;
                        }
                        return [2 /*return*/, this.formatter.blockTag(blockNumber)];
                    case 3: return [2 /*return*/, this.formatter.blockTag(blockTag)];
                }
            });
        });
    };
    BaseProvider.prototype._getResolver = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var network, transaction, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getNetwork()];
                    case 1:
                        network = _c.sent();
                        // No ENS...
                        if (!network.ensAddress) {
                            logger.throwError('network does not support ENS', logger_1.Logger.errors.UNSUPPORTED_OPERATION, { operation: 'ENS', network: network.name });
                        }
                        transaction = {
                            to: network.ensAddress,
                            data: ('0x0178b8bf' + hash_1.namehash(name).substring(2))
                        };
                        _b = (_a = this.formatter).callAddress;
                        return [4 /*yield*/, this.call(transaction)];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    BaseProvider.prototype.resolveName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var resolverAddress, transaction, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, name];
                    case 1:
                        name = _c.sent();
                        // If it is already an address, nothing to resolve
                        try {
                            return [2 /*return*/, Promise.resolve(this.formatter.address(name))];
                        }
                        catch (error) {
                            // If is is a hexstring, the address is bad (See #694)
                            if (bytes_1.isHexString(name)) {
                                throw error;
                            }
                        }
                        if (typeof (name) !== 'string') {
                            logger.throwArgumentError('invalid ENS name', 'name', name);
                        }
                        return [4 /*yield*/, this._getResolver(name)];
                    case 2:
                        resolverAddress = _c.sent();
                        if (!resolverAddress) {
                            return [2 /*return*/, null];
                        }
                        transaction = {
                            to: resolverAddress,
                            data: ('0x3b3b57de' + hash_1.namehash(name).substring(2))
                        };
                        _b = (_a = this.formatter).callAddress;
                        return [4 /*yield*/, this.call(transaction)];
                    case 3: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    BaseProvider.prototype.lookupAddress = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var reverseName, resolverAddress, bytes, _a, length, name, addr;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, address];
                    case 1:
                        address = _b.sent();
                        address = this.formatter.address(address);
                        reverseName = address.substring(2).toLowerCase() + '.addr.reverse';
                        return [4 /*yield*/, this._getResolver(reverseName)];
                    case 2:
                        resolverAddress = _b.sent();
                        if (!resolverAddress) {
                            return [2 /*return*/, null];
                        }
                        _a = bytes_1.arrayify;
                        return [4 /*yield*/, this.call({
                                to: resolverAddress,
                                data: ('0x691f3431' + hash_1.namehash(reverseName).substring(2))
                            })];
                    case 3:
                        bytes = _a.apply(void 0, [_b.sent()]);
                        // Strip off the dynamic string pointer (0x20)
                        if (bytes.length < 32 || !bignumber_1.BigNumber.from(bytes.slice(0, 32)).eq(32)) {
                            return [2 /*return*/, null];
                        }
                        bytes = bytes.slice(32);
                        // Not a length-prefixed string
                        if (bytes.length < 32) {
                            return [2 /*return*/, null];
                        }
                        length = bignumber_1.BigNumber.from(bytes.slice(0, 32)).toNumber();
                        bytes = bytes.slice(32);
                        // Length longer than available data
                        if (length > bytes.length) {
                            return [2 /*return*/, null];
                        }
                        name = strings_1.toUtf8String(bytes.slice(0, length));
                        return [4 /*yield*/, this.resolveName(name)];
                    case 4:
                        addr = _b.sent();
                        if (addr != address) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, name];
                }
            });
        });
    };
    BaseProvider.prototype.perform = function (method, params) {
        return logger.throwError(method + ' not implemented', logger_1.Logger.errors.NOT_IMPLEMENTED, { operation: method });
    };
    BaseProvider.prototype._startEvent = function (event) {
        this.polling = (this._events.filter(function (e) { return e.pollable(); }).length > 0);
    };
    BaseProvider.prototype._stopEvent = function (event) {
        this.polling = (this._events.filter(function (e) { return e.pollable(); }).length > 0);
    };
    BaseProvider.prototype._addEventListener = function (eventName, listener, once) {
        var event = new Event(getEventTag(eventName), listener, once);
        this._events.push(event);
        this._startEvent(event);
        return this;
    };
    BaseProvider.prototype.on = function (eventName, listener) {
        return this._addEventListener(eventName, listener, false);
    };
    BaseProvider.prototype.once = function (eventName, listener) {
        return this._addEventListener(eventName, listener, true);
    };
    BaseProvider.prototype.emit = function (eventName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var result = false;
        var stopped = [];
        var eventTag = getEventTag(eventName);
        this._events = this._events.filter(function (event) {
            if (event.tag !== eventTag) {
                return true;
            }
            setTimeout(function () {
                event.listener.apply(_this, args);
            }, 0);
            result = true;
            if (event.once) {
                stopped.push(event);
                return false;
            }
            return true;
        });
        stopped.forEach(function (event) { _this._stopEvent(event); });
        return result;
    };
    BaseProvider.prototype.listenerCount = function (eventName) {
        if (!eventName) {
            return this._events.length;
        }
        var eventTag = getEventTag(eventName);
        return this._events.filter(function (event) {
            return (event.tag === eventTag);
        }).length;
    };
    BaseProvider.prototype.listeners = function (eventName) {
        if (eventName == null) {
            return this._events.map(function (event) { return event.listener; });
        }
        var eventTag = getEventTag(eventName);
        return this._events
            .filter(function (event) { return (event.tag === eventTag); })
            .map(function (event) { return event.listener; });
    };
    BaseProvider.prototype.off = function (eventName, listener) {
        var _this = this;
        if (listener == null) {
            return this.removeAllListeners(eventName);
        }
        var stopped = [];
        var found = false;
        var eventTag = getEventTag(eventName);
        this._events = this._events.filter(function (event) {
            if (event.tag !== eventTag || event.listener != listener) {
                return true;
            }
            if (found) {
                return true;
            }
            found = true;
            stopped.push(event);
            return false;
        });
        stopped.forEach(function (event) { _this._stopEvent(event); });
        return this;
    };
    BaseProvider.prototype.removeAllListeners = function (eventName) {
        var _this = this;
        var stopped = [];
        if (eventName == null) {
            stopped = this._events;
            this._events = [];
        }
        else {
            var eventTag_1 = getEventTag(eventName);
            this._events = this._events.filter(function (event) {
                if (event.tag !== eventTag_1) {
                    return true;
                }
                stopped.push(event);
                return false;
            });
        }
        stopped.forEach(function (event) { _this._stopEvent(event); });
        return this;
    };
    return BaseProvider;
}(abstract_provider_1.Provider));
exports.BaseProvider = BaseProvider;

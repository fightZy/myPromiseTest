"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var waitQueue = /** @class */ (function () {
    function waitQueue(arg) {
        if (arg === void 0) { arg = { syncCallbackArgs: {} }; }
        var syncCallbackArgs = arg.syncCallbackArgs;
        this.stop = false;
        this.syncCallbackArgs = syncCallbackArgs;
        this.queues = Object.create(null);
        this.hangQueResolve = Object.create(null);
    }
    waitQueue.prototype.clearHangQue = function (id) {
        delete this.queues[id];
        delete this.hangQueResolve[id];
    };
    /**
     * 继续执行挂起的队列
     * @param id 队列id
     * @param arg 入参
     */
    waitQueue.prototype.continueQueue = function (id, arg) {
        var queResolve = this.hangQueResolve[id];
        if (queResolve) {
            queResolve(arg);
            this.clearHangQue(id);
        }
    };
    /**
     * 挂起指定的同步队列，使得队列返回的promise在所给的任务执行完后仍是pending状态，直到调用continueQueue(id)
     * @params id 创建同步队列时传入的id
     * */
    waitQueue.prototype.hangSyncQue = function (id) {
        if (this.hangQueResolve[id])
            return;
        var que = this.queues[id];
        if (que) {
            var resolveFn_1 = function () { };
            var hangPromise_1 = new Promise(function (resolve) { return resolveFn_1 = resolve; });
            this.hangQueResolve[id] = resolveFn_1;
            var event_1 = this.getAsyncEvent(function () { return hangPromise_1; });
            que.push(event_1);
        }
    };
    waitQueue.prototype.getIterable = function (data, callback) {
        var _this = this;
        return data.map(function (v, i) {
            return _this.getAsyncEvent.apply(_this, v)(callback !== null && callback !== void 0 ? callback : (function () { }), i);
        });
    };
    /**
     * 创建并发队列
     * @params data 执行队列，由[执行事件, 默认参数]组成的二维数组
     * @params callback 回调，会传入事件的执行结果，对应的下标，以及自定义回调参数
     * @returns 返回一个函数，行数执行返回代表该执行队列全部执行结果的Promise
     * */
    waitQueue.prototype.createConcurrent = function (data, callback) {
        var _this = this;
        return function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.getIterable(data, callback))];
                    case 1: return [2 /*return*/, (_a.sent()).map(function (_a) {
                            var data = _a.data, error = _a.error;
                            return data || error;
                        })];
                }
            });
        }); };
    };
    waitQueue.prototype.getAsyncEvent = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return function (callback, i, res) { return __awaiter(_this, void 0, void 0, function () {
            var _res, _a, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _res = { success: true, data: undefined };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, 7, 8]);
                        _b = {
                            success: true
                        };
                        if (!res) return [3 /*break*/, 3];
                        return [4 /*yield*/, event.apply(void 0, __spreadArray([res], args, false))];
                    case 2:
                        _a = _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, event.apply(void 0, args)];
                    case 4:
                        _a = _c.sent();
                        _c.label = 5;
                    case 5:
                        _res = (_b.data = _a,
                            _b);
                        return [3 /*break*/, 8];
                    case 6:
                        error_1 = _c.sent();
                        _res = { success: false, error: '' + error_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        callback(_res, i, this.syncCallbackArgs);
                        return [2 /*return*/, _res];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
    };
    /**
     * 创建同步队列，事件调用时，如果上一个事件返回值不为空，则会作为当前事件的第一个参数，否则使用默认参数，最终
     * @param ques 执行队列，由[执行事件, 默认参数]组成的二维数组
     * @param callback 回调
     * @param id 该队列的唯一id，不传则不会储存该队列
     * @returns 返回一个函数，行数执行返回代表该执行队列全部执行结果的Promise
     */
    waitQueue.prototype.createSync = function (ques, callback, id) {
        var _this = this;
        return function () { return __awaiter(_this, void 0, void 0, function () {
            var res, resArr, curQue, i, _a, data, error;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        resArr = [];
                        curQue = ques.map(function (v) { return _this.getAsyncEvent.apply(_this, v); });
                        if (id)
                            this.queues[id] = curQue;
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < curQue.length)) return [3 /*break*/, 6];
                        if (!this.stop) return [3 /*break*/, 2];
                        res = undefined;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, curQue[i](callback !== null && callback !== void 0 ? callback : (function () { }), i, res)];
                    case 3:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        res = data || error;
                        _b.label = 4;
                    case 4:
                        resArr.push(res);
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, resArr];
                }
            });
        }); };
    };
    /**
     * 使得同步队列停止执行
     */
    waitQueue.prototype.abortQue = function () {
        this.stop = true;
    };
    /**
     * 允许同步队列执行
     */
    waitQueue.prototype.allowQue = function () {
        this.stop = false;
    };
    return waitQueue;
}());
exports["default"] = waitQueue;

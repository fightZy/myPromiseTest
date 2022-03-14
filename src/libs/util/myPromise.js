"use strict";
// todo prefect myPromiseLike
exports.__esModule = true;
// const microTask = (fn) => Promise.resolve().then(fn)
var microTask = function (fn) { return setTimeout(fn); };
var myPromise = /** @class */ (function () {
    function myPromise(fn) {
        this.state = 'pending';
        this.onfulfilledCallback = [];
        this.onrejectedCallback = [];
        this.returnPromiseHandlers = [];
        Object.defineProperties(this, ['onfulfilledCallback', 'onrejectedCallback', 'returnPromiseHandlers'].reduce(function (pre, v) {
            pre[v] = {
                writable: false,
                enumerable: false,
                configurable: false
            };
            return pre;
        }, {}));
        try {
            fn(this.resolve.bind(this), this.reject.bind(this));
        }
        catch (error) {
            this.reject(error);
        }
    }
    myPromise.prototype.resolve = function (value) {
        var _this = this;
        if (this.state !== 'pending')
            return;
        this.resolveValue(value, this, [function (res) {
                if (_this.state !== 'pending')
                    return;
                _this.state = "fulfilled";
                _this.result = res;
                _this.resolveType(_this.state);
            }, function (res) {
                if (_this.state !== 'pending')
                    return;
                _this.state = "rejected";
                _this.result = res;
                _this.resolveType(_this.state);
            }]);
    };
    myPromise.resolve = function (value) {
        return new myPromise(function (res) { return res(value); });
    };
    myPromise.reject = function (reason) {
        return new myPromise(function (res, rej) { return rej(reason); });
    };
    myPromise.prototype.resolveType = function (type) {
        if (this.state === 'pending')
            throw SyntaxError('resolveType' + type);
        var callbacks = this[type === 'fulfilled' ? 'onfulfilledCallback' : 'onrejectedCallback'];
        // microTask(() => {
        if (callbacks.length === 0 && type === "rejected")
            return this.logError(this.result);
        for (var i = 0; i < callbacks.length; i++) {
            var fn = callbacks[i];
            var pHandlers = this.returnPromiseHandlers[i];
            this.resolveCb(fn, pHandlers);
            // this.resolveValue(this.result, pHandlers)
        }
        // });
    };
    myPromise.prototype.resolveCb = function (fn, pHandlers) {
        var _this = this;
        microTask(function () {
            try {
                var res = void 0;
                if (typeof fn === 'function') {
                    res = fn(_this.result);
                }
                else {
                    pHandlers[_this.state === 'fulfilled' ? 0 : 1](_this.result);
                    return;
                }
                pHandlers[0](res);
            }
            catch (error) {
                pHandlers[1](error);
            }
        });
    };
    // * 解决各种value
    myPromise.prototype.resolveValue = function (value, promiseInstance, pHandlers) {
        var _this = this;
        if (value === promiseInstance) {
            return pHandlers[1](TypeError(' Chaining cycle detected for promise '));
        }
        if (value instanceof myPromise) {
            microTask(function () {
                value.then.apply(value, pHandlers);
            });
        }
        else if ((typeof value === 'object' && value !== null) || typeof value === "function") {
            var called_1 = false;
            // val 如果是 thenable或myPromise, 则又需要等待其调用，“等待”有可能是异步的，所以需要标志避免重复调用
            try {
                // 保存then, 避免第二次取then与第一次不同
                var then_1 = value.then;
                if (typeof then_1 === "function") {
                    microTask(function () {
                        try {
                            then_1.call(value, function (val) {
                                if (called_1)
                                    return;
                                called_1 = true;
                                _this.resolveValue(val, promiseInstance, pHandlers);
                            }, function (reason) {
                                if (called_1)
                                    return;
                                called_1 = true;
                                pHandlers[1](reason);
                            });
                        }
                        catch (error) {
                            if (called_1)
                                return;
                            called_1 = true;
                            pHandlers[1](error);
                        }
                    });
                }
                else {
                    if (called_1)
                        return;
                    called_1 = true;
                    pHandlers[0](value);
                }
            }
            catch (error) {
                if (called_1)
                    return;
                called_1 = true;
                pHandlers[1](error);
            }
        }
        else {
            pHandlers[0](value);
        }
    };
    myPromise.prototype.reject = function (reason) {
        if (this.state !== 'pending')
            return;
        this.state = 'rejected';
        this.result = reason;
        this.resolveType('rejected');
    };
    myPromise.prototype.then = function (onfulfilled, onrejected) {
        var _this = this;
        var resPromise = new myPromise(function (res, rej) {
            if (_this.state === "pending") {
                _this.onfulfilledCallback.push(onfulfilled);
                _this.onrejectedCallback.push(onrejected);
                _this.returnPromiseHandlers.push([res, rej]);
            }
            else {
                _this.resolveCb(_this.state === 'fulfilled' ? onfulfilled : onrejected, [res, rej]);
            }
        });
        return resPromise;
    };
    myPromise.prototype.deferred = function () {
        var obj = {};
        obj.promise = new myPromise(function (res, rej) {
            obj.resolve = res;
            obj.reject = rej;
        });
        return obj;
    };
    myPromise.prototype["catch"] = function (onrejected) {
        return this.then(undefined, onrejected);
    };
    myPromise.prototype["finally"] = function (onfinally) {
        var _this = this;
        return this
            .then(onfinally, function (err) {
            onfinally && onfinally();
            // todo : 模拟onfinally不捕获错误
            // this.logError(err);
        })
            .then(function () {
            if (_this.state === "fulfilled")
                return _this.result;
            else
                throw _this.result;
        });
    };
    myPromise.prototype.logError = function (err) {
        // console.error("__Uncaught (in myPromise)", err)
    };
    return myPromise;
}());
var p = new myPromise(function (res) {
    res();
});
// Promise.resolve().then;
// exports["default"] = myPromise;
module.exports = p;

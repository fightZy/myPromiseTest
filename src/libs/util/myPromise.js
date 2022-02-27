// todo prefect myPromiseLike
// const microTask = (fn) => Promise.resolve().then(fn)
const microTask = (fn) => setTimeout(fn);
class myPromise {
    state = 'pending';
    result;
    onfulfilledCallback;
    onrejectedCallback;
    returnPromiseHandlers;
    constructor(fn) {
        this.onfulfilledCallback = [];
        this.onrejectedCallback = [];
        this.returnPromiseHandlers = [];
        Object.defineProperties(this, ['onfulfilledCallback', 'onrejectedCallback', 'returnPromiseHandlers'].reduce((pre, v) => {
            pre[v] = {
                writable: false,
                enumerable: false,
                configurable: false,
            };
            return pre;
        }, {}));
        // try {
        fn(this.resolve.bind(this), this.reject.bind(this));
        // } catch (error) {
        //       this.reject(error)
        // }
    }
    resolve(value) {
        if (this.state !== 'pending')
            return;
        this.resolveValue(value, [res => {
                if (this.state !== 'pending')
                    return;
                this.state = "fulfilled";
                this.result = res;
                this.resolveType(this.state);
            }, res => {
                if (this.state !== 'pending')
                    return;
                this.state = "rejected";
                this.result = res;
                this.resolveType(this.state);
            }]);
    }
    static resolve(value) {
        return new myPromise((res) => res(value));
    }
    static reject(reason) {
        return new myPromise((res, rej) => rej(reason));
    }
    resolveType(type) {
        if (this.state === 'pending')
            throw SyntaxError('resolveType' + type);
        const callbacks = this[type === 'fulfilled' ? 'onfulfilledCallback' : 'onrejectedCallback'];
        // microTask(() => {
        if (callbacks.length === 0 && type === "rejected")
            return this.logError(this.result);
        for (let i = 0; i < callbacks.length; i++) {
            const fn = callbacks[i];
            const pHandlers = this.returnPromiseHandlers[i];
            this.resolveCb(fn, pHandlers);
        }
        // });
    }
    resolveCb(fn, pHandlers) {
        microTask(() => {
            try {
                let res;
                if (typeof fn === 'function') {
                    res = fn(this.result);
                }
                else {
                    pHandlers[this.state === 'fulfilled' ? 0 : 1](this.result);
                    return;
                }
                pHandlers[0](res);
            }
            catch (error) {
                pHandlers[1](error);
            }
        });
    }
    // * 解决各种value
    resolveValue(value, pHandlers) {
        if (value === this) {
            return pHandlers[1](TypeError(' Chaining cycle detected for promise '));
        }
        if (value instanceof myPromise) {
            value.then(...pHandlers);
        }
        else if ((typeof value === 'object' && value !== null) || typeof value === "function") {
            let called = false;
            // val 如果是 thenable或myPromise, 则又需要等待其调用，“等待”有可能是异步的，所以需要标志避免重复调用
            try {
                // 保存then, 避免第二次取then与第一次不同
                let then = value.then;
                if (typeof then === "function") {
                    then.call(value, (val) => {
                        if (called)
                            return;
                        called = true;
                        this.resolveValue(val, pHandlers);
                    }, (reason) => {
                        if (called)
                            return;
                        called = true;
                        pHandlers[1](reason);
                    });
                }
                else {
                    pHandlers[0](value);
                }
            }
            catch (error) {
                if (called)
                    return;
                called = true;
                pHandlers[1](error);
            }
        }
        else {
            pHandlers[0](value);
        }
    }
    reject(reason) {
        if (this.state !== 'pending')
            return;
        this.state = 'rejected';
        this.result = reason;
        this.resolveType('rejected');
    }
    then(onfulfilled, onrejected) {
        // todo
        const resPromise = new myPromise((res, rej) => {
            if (this.state === "pending") {
                this.onfulfilledCallback.push(onfulfilled);
                this.onrejectedCallback.push(onrejected);
                this.returnPromiseHandlers.push([res, rej]);
            }
            else {
                this.resolveCb(this.state === 'fulfilled' ? onfulfilled : onrejected, [res, rej]);
            }
        });
        return resPromise;
    }
    deferred() {
        const obj = {};
        obj.promise = new myPromise((res, rej) => {
            obj.resolve = res;
            obj.reject = rej;
        });
        return obj;
    }
    catch(onrejected) {
        return this.then(undefined, onrejected);
    }
    finally(onfinally) {
        return this
            .then(onfinally, (err) => {
            onfinally && onfinally();
            // todo : 模拟onfinally不捕获错误
            // this.logError(err);
        })
            .then(() => {
            if (this.state === "fulfilled")
                return this.result;
            else
                throw this.result;
        });
    }
    logError(err) {
        // console.error("__Uncaught (in myPromise)", err)
    }
}
const p = new myPromise((res) => {
    res();
});
Promise.resolve().then;
export default myPromise;
// module.exports = p;

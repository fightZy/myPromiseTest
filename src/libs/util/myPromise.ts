// todo prefect myPromiseLike

interface PromiseLike<T> {
      /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
      then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
}
// const microTask = (fn) => Promise.resolve().then(fn)
const microTask = (fn) => setTimeout(fn)

class myPromise<T>{

      state: 'pending' | 'fulfilled' | 'rejected' = 'pending'
      result: any
      private readonly onfulfilledCallback: (((res: any) => any) | null | undefined)[]
      private readonly onrejectedCallback: (((res: any) => any) | null | undefined)[]
      private readonly returnPromiseHandlers: [(value?: T | myPromise<T>) => void, (res: any) => void][]
      constructor(
            fn: (res: (value?: T | myPromise<T>) => void, rej: (value?: any) => void) => void
      ) {
            this.onfulfilledCallback = [];
            this.onrejectedCallback = [];
            this.returnPromiseHandlers = [];
            Object.defineProperties(this,
                  ['onfulfilledCallback', 'onrejectedCallback', 'returnPromiseHandlers'].reduce((pre, v) => {
                        pre[v] = {
                              writable: false,
                              enumerable: false,
                              configurable: false,
                        }
                        return pre;
                  }, {})
            )
            try {
                  fn(this.resolve.bind(this), this.reject.bind(this))
            } catch (error) {
                  this.reject(error)
            }
      }

      resolve(value?: T | myPromise<T> | { then: Function }): void {
            if (this.state !== 'pending') return;
            this.resolveValue(value, this, [res => {
                  if (this.state !== 'pending') return;
                  this.state = "fulfilled";
                  this.result = res
                  this.resolveType(this.state)
            }, res => {
                  if (this.state !== 'pending') return;
                  this.state = "rejected";
                  this.result = res;
                  this.resolveType(this.state)
            }])
      }

      static resolve(value?: any) {
            return new myPromise((res) => res(value));
      }

      static reject(reason?: any) {
            return new myPromise((res, rej) => rej(reason));
      }

      private resolveType(type: 'fulfilled' | 'rejected' | 'pending') {
            if (this.state === 'pending') throw SyntaxError('resolveType' + type);
            const callbacks = this[type === 'fulfilled' ? 'onfulfilledCallback' : 'onrejectedCallback'];
            // microTask(() => {
            if (callbacks.length === 0 && type === "rejected") return this.logError(this.result);

            for (let i = 0; i < callbacks.length; i++) {
                  const fn = callbacks[i];
                  const pHandlers = this.returnPromiseHandlers[i];
                  this.resolveCb(fn, pHandlers);
                  // this.resolveValue(this.result, pHandlers)
            }
            // });
      }

      private resolveCb(fn: ((res: any) => any) | null | undefined, pHandlers: [(value?: T | myPromise<T> | { then: Function }) => void, (res: any) => void]) {
            microTask(() => {
                  try {
                        let res: any;
                        if (typeof fn === 'function') {
                              res = fn(this.result)
                        } else {
                              pHandlers[this.state === 'fulfilled' ? 0 : 1](this.result);
                              return;
                        }
                        pHandlers[0](res)
                  } catch (error) {
                        pHandlers[1](error)
                  }
            })

      }

      // * 解决各种value
      resolveValue(value: any, promiseInstance: myPromise<any>, pHandlers: [(value?: T | myPromise<T> | { then: Function }) => void, (res: any) => void]) {
            if (value === promiseInstance) {
                  return pHandlers[1](TypeError(' Chaining cycle detected for promise '))
            }
            if (value instanceof myPromise) {
                  // * 测试用例中不包含这种情况异步测试，，这的then会在异步中调用
                  microTask(() => {
                        value.then(...pHandlers)
                  })
            } else if ((typeof value === 'object' && value !== null) || typeof value === "function") {
                  let called = false;
                  // val 如果是 thenable或myPromise, 则又需要等待其调用，“等待”有可能是异步的，所以需要标志避免重复调用
                  try {
                        // 保存then, 避免第二次取then与第一次不同
                        let then = value.then;
                        if (typeof then === "function") {
                              microTask(() => {
                                    try {
                                          then.call(value, (val) => {
                                                if (called) return;
                                                called = true;
                                                this.resolveValue(val, promiseInstance, pHandlers)
                                          }, (reason) => {
                                                if (called) return;
                                                called = true;
                                                pHandlers[1](reason)
                                          })
                                    } catch (error) {
                                          if (called) return;
                                          called = true;
                                          pHandlers[1](error)
                                    }
                              })
                        } else {
                              if (called) return;
                              called = true;
                              pHandlers[0](value)
                        }
                  } catch (error) {
                        if (called) return;
                        called = true;
                        pHandlers[1](error)
                  }
            } else {
                  pHandlers[0](value)
            }

      }

      reject(reason?: any) {
            if (this.state !== 'pending') return;
            this.state = 'rejected';
            this.result = reason;
            this.resolveType('rejected')

      }

      then(
            onfulfilled?: ((res: any) => any) | any,
            onrejected?: ((reason: any) => any) | any
      ) {
            const resPromise = new myPromise((res, rej) => {
                  if (this.state === "pending") {
                        this.onfulfilledCallback.push(onfulfilled)
                        this.onrejectedCallback.push(onrejected)
                        this.returnPromiseHandlers.push([res, rej])
                  } else {
                        this.resolveCb(this.state === 'fulfilled' ? onfulfilled : onrejected, [res, rej]);
                  }
            })
            return resPromise;
      }

      deferred() {
            const obj: {
                  promise?: myPromise<any>,
                  resolve?: Function,
                  reject?: Function,
            } = {};
            obj.promise = new myPromise((res, rej) => {
                  obj.resolve = res;
                  obj.reject = rej;
            })
            return obj;
      }

      catch(onrejected?: ((reason: any) => any) | null) {
            return this.then(undefined, onrejected);
      }

      finally(onfinally?: (() => void) | undefined | null) {
            return this
                  .then(onfinally, (err) => {
                        onfinally && onfinally()
                        // todo : 模拟onfinally不捕获错误
                        // this.logError(err);
                  })
                  .then(() => {
                        if (this.state === "fulfilled") return this.result;
                        else throw this.result;
                  });
      }

      logError(err: any) {
            // console.error("__Uncaught (in myPromise)", err)
      }

}

const p = new myPromise((res) => {
      res()
})
Promise.resolve().then
export default myPromise;
// module.exports = p;

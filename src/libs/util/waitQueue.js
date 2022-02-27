export default class waitQueue {
      // constructor({ syncCallbackArgs = [] } = {}) {
      constructor({ syncCallbackArgs = {} } = {}) {
            this.stop = false;
            this.syncCallbackArgs = syncCallbackArgs;

            this.queues = {};
            this.hangQueResolve = {};
      }

      clearHangQueForce() {
            this.queues = {};
            Object.keys(this.hangQueResolve).forEach(id => {
                  this.hangQueResolve[id]();
            })
            this.hangQueResolve = {};
      }

      clearHangQue(id) {
            this.queues[id] = null;
            this.hangQueResolve[id] = null;
      }

      continueQueue(id, arg) {
            let queResolve = this.hangQueResolve[id];
            if (queResolve) {
                  queResolve(arg)
                  this.clearHangQue(id);
                  // console.log('%ccontinueQueue success', 'color:#0FFF5FD0', id);
            }
      }

      hangSyncQue = async (id) => {
            if (this.hangQueResolve[id]) return;
            let que = this.queues[id];
            if (que) {
                  const hangPromise = new Promise((resolve) => this.hangQueResolve[id] = resolve)
                  que.push(this.asyncEvent(() => hangPromise))
                  // console.log('%c挂起了', 'color:#35C7E0', id, this.hangQueResolve[id]);
            }
      }

      getIterable(data, callback) {
            return data.map((v, i) => this.asyncEvent(...v)(callback ?? (() => { }), i))
      }

      /**
       * 创建异步并发
       * @param {[Promise<T>,...args][]} data 
       * @param {function[]} 回调
       * @returns 
       */
      createConcurrent(data, callback) {
            return async () => {
                  return await Promise.all(this.getIterable(data, callback))
            }
      }

      /**
       * 
       * @param {*} event 
       * @param  {...any} args 
       * @returns 
       */
      asyncEvent(event, ...args) {
            return async (callback, i, res) => {
                  let _res;
                  try {
                        _res = res ? await event(res, ...args) : await event(...args);
                        _res = {
                              success: true,
                              data: _res,
                        }
                  } catch (error) {
                        console.log('error;', error);
                        _res = { success: false, error: '' + error, }
                  } finally {
                        callback(_res, i, this.syncCallbackArgs);
                        return _res
                  }

            }
      }

      createSync(data, callback, id) {
            console.log(id);
            return async () => {
                  let res = null;
                  let resArr = [];
                  data = data.map((v) => this.asyncEvent(...v));
                  // console.log(data);
                  if (id) this.queues[id] = data;
                  for (let i = 0; i < data.length; i++) {
                        if (this.stop) {
                              res = undefined;
                        } else {
                              const { data: _data, error } = await data[i](callback ?? (() => { }), i, res);
                              // console.log(i, _data, error);
                              res = _data || error;
                        }
                        resArr.push(res)

                  }
                  return resArr;
            }
      }

      abortQue = (err) => {
            // debugger
            this.stop = true;
      }

      allowQue = () => {
            this.stop = false;
      }

}
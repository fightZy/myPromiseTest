export default class waitQueue {
    stop;
    syncCallbackArgs;
    queues;
    hangQueResolve;
    constructor(arg = { syncCallbackArgs: {} }) {
        const { syncCallbackArgs } = arg;
        this.stop = false;
        this.syncCallbackArgs = syncCallbackArgs;
        this.queues = Object.create(null);
        this.hangQueResolve = Object.create(null);
    }
    clearHangQue(id) {
        delete this.queues[id];
        delete this.hangQueResolve[id];
    }
    /**
     * 继续执行挂起的队列
     * @param id 队列id
     * @param arg 入参
     */
    continueQueue(id, arg) {
        let queResolve = this.hangQueResolve[id];
        if (queResolve) {
            queResolve(arg);
            this.clearHangQue(id);
        }
    }
    /**
     * 挂起指定的同步队列，使得队列返回的promise在所给的任务执行完后仍是pending状态，直到调用continueQueue(id)
     * @params id 创建同步队列时传入的id
     * */
    hangSyncQue(id) {
        if (this.hangQueResolve[id])
            return;
        let que = this.queues[id];
        if (que) {
            let resolveFn = () => { };
            const hangPromise = new Promise(resolve => resolveFn = resolve);
            this.hangQueResolve[id] = resolveFn;
            const event = this.getAsyncEvent(() => hangPromise);
            que.push(event);
        }
    }
    getIterable(data, callback) {
        return data.map((v, i) => this.getAsyncEvent(...v)(callback ?? (() => { }), i));
    }
    /**
     * 创建并发队列
     * @params data 执行队列，由[执行事件, 默认参数]组成的二维数组
     * @params callback 回调，会传入事件的执行结果，对应的下标，以及自定义回调参数
     * @returns 返回一个函数，行数执行返回代表该执行队列全部执行结果的Promise
     * */
    createConcurrent(data, callback) {
        return async () => {
            return (await Promise.all(this.getIterable(data, callback))).map(({ data, error }) => data || error);
        };
    }
    getAsyncEvent(event, ...args) {
        return async (callback, i, res) => {
            let _res = { success: true, data: undefined };
            try {
                _res = {
                    success: true,
                    data: res ? await event(res, ...args) : await event(...args)
                };
            }
            catch (error) {
                _res = { success: false, error: '' + error };
            }
            finally {
                callback(_res, i, this.syncCallbackArgs);
                return _res;
            }
        };
    }
    /**
     * 创建同步队列，事件调用时，如果上一个事件返回值不为空，则会作为当前事件的第一个参数，否则使用默认参数，最终
     * @param ques 执行队列，由[执行事件, 默认参数]组成的二维数组
     * @param callback 回调
     * @param id 该队列的唯一id，不传则不会储存该队列
     * @returns 返回一个函数，行数执行返回代表该执行队列全部执行结果的Promise
     */
    createSync(ques, callback, id) {
        return async () => {
            let res;
            const resArr = [];
            const curQue = ques.map(v => this.getAsyncEvent(...v));
            if (id)
                this.queues[id] = curQue;
            for (let i = 0; i < curQue.length; i++) {
                if (this.stop) {
                    res = undefined;
                }
                else {
                    const { data, error } = await curQue[i](callback ?? (() => { }), i, res);
                    res = data || error;
                }
                resArr.push(res);
            }
            return resArr;
        };
    }
    /**
     * 使得同步队列停止执行
     */
    abortQue() {
        this.stop = true;
    }
    /**
     * 允许同步队列执行
     */
    allowQue() {
        this.stop = false;
    }
}

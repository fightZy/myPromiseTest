var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class waitQueue {
    constructor(arg = { syncCallbackArgs: {} }) {
        const { syncCallbackArgs } = arg;
        this.stop = false;
        this.syncCallbackArgs = syncCallbackArgs;
        this.queues = Object.create(null);
        this.hangQueResolve = Object.create(null);
    }
    // clearHangQueForce () {
    //   this.queues = {}
    //   Object.keys(this.hangQueResolve).forEach(id => {
    //     this.hangQueResolve[id] && this.hangQueResolve[id]()
    //   })
    //   this.hangQueResolve = Object.create(null)
    // }
    clearHangQue(id) {
        delete this.queues[id];
        delete this.hangQueResolve[id];
    }
    continueQueue(id, arg) {
        let queResolve = this.hangQueResolve[id];
        if (queResolve) {
            queResolve(arg);
            this.clearHangQue(id);
        }
    }
    /**
     * 挂起指定的同步队列，即使得队列在指定位置停止，即使得createSync返回的Promise一直不会决议，直到调用continueQueue
     * @params id 创建同步队列时传入的id
     * @params index 指定停止队列的位置，默认插入队尾
     * */
    hangSyncQue(id, index) {
        if (this.hangQueResolve[id])
            return;
        let que = this.queues[id];
        if (que) {
            const hangPromise = new Promise(resolve => (this.hangQueResolve[id] = resolve));
            const event = this.getAsyncEvent(() => hangPromise);
            if (index) {
                que.splice(index, 0, event);
            }
            else {
                que.push(event);
            }
        }
    }
    getIterable(data, callback) {
        return data.map((v, i) => this.getAsyncEvent(...v)(callback !== null && callback !== void 0 ? callback : (() => { }), i));
    }
    /**
     * 创建并发队列
     * @params data 指定
     * */
    createConcurrent(data, callback) {
        return () => __awaiter(this, void 0, void 0, function* () {
            return yield Promise.all(this.getIterable(data, callback));
        });
    }
    getAsyncEvent(event, ...args) {
        return (callback, i, res) => __awaiter(this, void 0, void 0, function* () {
            let _res = { success: true, data: undefined };
            try {
                _res = {
                    success: true,
                    data: res ? yield event(res, ...args) : yield event(...args)
                };
            }
            catch (error) {
                _res = { success: false, error: '' + error };
            }
            finally {
                callback(_res, i, this.syncCallbackArgs);
                return _res;
            }
        });
    }
    createSync(ques, callback, id) {
        console.log(id);
        return () => __awaiter(this, void 0, void 0, function* () {
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
                    const { data, error } = yield curQue[i](callback !== null && callback !== void 0 ? callback : (() => { }), i, res);
                    res = data || error;
                }
                resArr.push(res);
            }
            return resArr;
        });
    }
    abortQue(id) {
        const que = this.queues[id];
        if (que) {
        }
    }
    abortAllQue() {
        // debugger
        this.stop = true;
    }
    allowQue() {
        this.stop = false;
    }
}

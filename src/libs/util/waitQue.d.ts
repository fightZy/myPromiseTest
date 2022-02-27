/**
 * 事件回调传入的第三个参数对象
 */
interface syncCallbackArgs {
    [name: string]: any;
}
interface asyncEvent {
    (callback: (res: {}, i: number, cb: syncCallbackArgs) => any, i: number, res?: any): Promise<normalResult>;
}
/**
 * 回调返回的第一个参数
 */
declare type normalResult = {
    success: boolean;
    data?: any;
    error?: string;
};
export default class waitQueue {
    stop: boolean;
    syncCallbackArgs: syncCallbackArgs;
    queues: {
        [id: string]: asyncEvent[];
    };
    hangQueResolve: {
        [id: string]: (value: any) => void | undefined;
    };
    constructor(arg?: {
        syncCallbackArgs: syncCallbackArgs;
    });
    private clearHangQue;
    /**
     * 继续执行挂起的队列
     * @param id 队列id
     * @param arg 入参
     */
    continueQueue(id: string, arg?: any): void;
    /**
     * 挂起指定的同步队列，使得队列返回的promise在所给的任务执行完后仍是pending状态，直到调用continueQueue(id)
     * @params id 创建同步队列时传入的id
     * */
    hangSyncQue(id: string): void;
    private getIterable;
    /**
     * 创建并发队列
     * @params data 执行队列，由[执行事件, 默认参数]组成的二维数组
     * @params callback 回调，会传入事件的执行结果，对应的下标，以及自定义回调参数
     * @returns 返回一个函数，行数执行返回代表该执行队列全部执行结果的Promise
     * */
    createConcurrent(data: [(...args: any[]) => Promise<any> | any, ...any[]][], callback?: (res: normalResult, i: number, cb: syncCallbackArgs) => any): () => Promise<any[]>;
    private getAsyncEvent;
    /**
     * 创建同步队列，事件调用时，如果上一个事件返回值不为空，则会作为当前事件的第一个参数，否则使用默认参数，最终
     * @param ques 执行队列，由[执行事件, 默认参数]组成的二维数组
     * @param callback 回调
     * @param id 该队列的唯一id，不传则不会储存该队列
     * @returns 返回一个函数，行数执行返回代表该执行队列全部执行结果的Promise
     */
    createSync(ques: [(...args: any[]) => Promise<any> | any, ...any[]][], callback?: (res: normalResult, i: number, cb: syncCallbackArgs) => any, id?: string): () => Promise<any[]>;
    /**
     * 使得同步队列停止执行
     */
    abortQue(): void;
    /**
     * 允许同步队列执行
     */
    allowQue(): void;
}
export {};

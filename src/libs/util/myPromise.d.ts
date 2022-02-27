declare class myPromise<T> {
    state: 'pending' | 'fulfilled' | 'rejected';
    result: any;
    private readonly onfulfilledCallback;
    private readonly onrejectedCallback;
    private readonly returnPromiseHandlers;
    constructor(fn: (res: (value?: T | myPromise<T>) => void, rej: (value?: any) => void) => void);
    resolve(value?: T | myPromise<T> | {
        then: Function;
    }): void;
    static resolve(value?: any): myPromise<unknown>;
    static reject(reason?: any): myPromise<unknown>;
    private resolveType;
    private resolveCb;
    resolveValue(value: any, pHandlers: [(value?: T | myPromise<T> | {
        then: Function;
    }) => void, (res: any) => void]): void;
    reject(reason?: any): void;
    then(onfulfilled?: ((res: any) => any) | any, onrejected?: ((reason: any) => any) | any): myPromise<unknown>;
    deferred(): {
        promise?: myPromise<any>;
        resolve?: Function;
        reject?: Function;
    };
    catch(onrejected?: ((reason: any) => any) | null): myPromise<unknown>;
    finally(onfinally?: (() => void) | undefined | null): myPromise<unknown>;
    logError(err: any): void;
}
export default myPromise;

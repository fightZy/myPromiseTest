import waitQueue from "./libs/util/waitQue";
import myPromise from "./libs/util/myPromise";

// let fn: (value: any) => void;
// // new myPromise(resolve => fn = resolve);
// function test() {
//       fn = () => { }
// }
// test();
// let a = fn;


// const a = function (value) {
//       return {
//             then: function (onFulfilled) {
//                   onFulfilled(value);
//                   onFulfilled(222);
//             }
//       };
// }
// const b = function (value) {
//       return {
//             then: function (onFulfilled) {
//                   setTimeout(function () {
//                         onFulfilled(value);
//                   }, 0);
//             }
//       };
// }
// const c = function (reason) {
//       var numberOfTimesThenRetrieved = 0;
//       return Object.create(null, {
//             then: {
//                   get: function () {
//                         if (numberOfTimesThenRetrieved === 0) {
//                               ++numberOfTimesThenRetrieved;
//                               return function (onFulfilled, onRejected) {
//                                     onRejected(reason);
//                               };
//                         }
//                         return null;
//                   }
//             }
//       });
// }
// const p = new myPromise((res, rej) => {
//       res(1)
// }).then((res1) => {
//       return {
//             then: (res2) => {
//                   res2(a(b(2)))
//             }
//       }
// })
// console.log(p);


// const _p1 = new myPromise((res, rej) => {
//       rej(1)
// })
// const _p2 = _p1.then().catch(err => console.log('err', err))
// setTimeout(() => {
//       console.log(_p1, _p2);
// })

// const p1 = new Promise((res, rej) => {
//       rej(1)
// })
// const p2 = p1.then().catch(err => console.log('err', err))
// setTimeout(() => {
//       console.log(p1, p2);
// })

// * ————————————————————————————————————————————————————————————————————————————————————————————

// const _p1 = new myPromise((res, rej) => {
//       rej(1)
// })
// setTimeout(() => {
//       // const _p2 = _p1.catch(err => console.log('err', err))
//       const _p2 = _p1.then(undefined, err => console.log('err', err))
//       console.log(_p1, _p2);
// }, 2000)

// const p1 = new Promise((res, rej) => {
//       rej(1)
// })
// setTimeout(() => {
//       // const p2 = p1.catch(err => console.log('err', err))
//       const p2 = p1.then(undefined, err => console.log('err', err))
//       console.log(p1, p2);
// }, 2000)

// * ————————————————————————————————————————————————————————————————————————————————————————————

// const _p1 = myPromise.resolve(new myPromise((res, rej) => {
//       setTimeout(() => {
//             res(1)
//       }, 1000);
// })).finally(() => {
//       console.log(123);
//       console.log(_p1);
// })
// console.log(_p1);

// const p1 = Promise.resolve(new Promise((res, rej) => {
//       setTimeout(() => {
//             res(1)
//       }, 1000);
// })).finally(() => {
//       console.log(123);
//       console.log(p1);
// })

// * ————————————————————————————————————————————————————————————————————————————————————————————

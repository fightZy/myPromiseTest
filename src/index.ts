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


myPromise.resolve().then(() => {
      console.log(0);
      return myPromise.resolve(4)
}).then((res) => {
      console.log(res);
})

myPromise.resolve().then(() => {
      console.log(1)
}).then(() => {
      console.log(2);

}).then(() => {
      console.log(3);

}).then(() => {
      console.log(5);

}).then(() => {
      console.log(6);

})

// console.log('====================================');
// console.log();
// console.log('====================================');

// debugger
// Promise.resolve().then(() => {
//       console.log(0);
//       return Promise.resolve(4)
// }).then((res) => {
//       console.log(res);
// })

// Promise.resolve().then(() => {
//       console.log(1)
// }).then(() => {
//       console.log(2);

// }).then(() => {
//       console.log(3);

// }).then(() => {
//       console.log(5);

// }).then(() => {
//       console.log(6);

// })

// debugger
// let p1 = Promise.resolve();
// let p2 = p1.then(() => {
//       console.log(0);
//       let p3 = Promise.resolve(4)
//       return p3 // p3.then((res)=> p2.resolve(res))
// })
// let p4 = p2.then(res => {
//       console.log(res);
// })


// Promise.resolve().then(() => {
//       console.log(1)
// }).then(() => {
//       console.log(2);

// }).then(() => {
//       console.log(3);

// }).then(() => {
//       console.log(5);

// }).then(() => {
//       console.log(6);

// })
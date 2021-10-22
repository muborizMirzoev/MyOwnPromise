function noop() {}

class MyOwnPromise {
   constructor(executor) {
      this.queue = [];
      this.errorHandler = noop;
      this.finallyHandler = noop;

      try {
         executor.call(null, this.onResolve.bind(this), this.onReject.bind(this))
      } catch (e) {
         this.errorHandler(e)
      } finally {
         this.finallyHandler()
      }
   }

   onResolve (data) {
      this.queue.forEach(callback => {
         data = callback(data)
      })
      this.finallyHandler()
   }

   onReject(error) {
      this.errorHandler(error)
      this.finallyHandler()
   }

   then(fn) {
      this.queue.push(fn)
      return this
   }

   catch(fn) {
      this.errorHandler = fn;
      return this
   }

   finally(fn) {
      this.finallyHandler = fn;
      return this
   }

   static all(iterable) {
      return new MyOwnPromise((resolve, reject) => {
         let results = [];
         let completed = 0;

         iterable.forEach((value, index) => {
            Promise.resolve(value).then(result => {
               results[index] = result;
               completed += 1;

               if (completed === iterable.length) {
                  resolve(results);
               }
            }).catch(err => reject(err));
         });
      });
   }

}

MyOwnPromise.all([
   new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
   new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
   new Promise(resolve => setTimeout(() => resolve(3), 1000)) // 3
]).then(data => console.log(data))
//
// // .then(data => console.log(data));

// const promise = new MyOwnPromise((resolve, reject) => {
//    setTimeout(() => {
//       resolve('hello')
//
//    }, 100)
// })
//
// promise
//    .then(text => text.toUpperCase())
//    .then(title => console.log('Hi Promise', title))
//    .catch(err => console.log('Error', err))
//    .finally(() => console.log('Finally'))

// module.exports = MyOwnPromise;



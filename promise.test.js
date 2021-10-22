const MyOwnPromise = require('./promise');

const t = setTimeout

describe('My Own Promise: ', () => {
   let promise
   let executorSpy

   const successResult = 42;
   const errorResult = 'Error'

   beforeEach(() => {
      executorSpy = jest.fn(r => t(() => r(successResult), 100))
      promise = new MyOwnPromise(executorSpy)
   })

   test('should exist and to be typeof function', () => {
      expect(MyOwnPromise).toBeDefined()
      expect(typeof MyOwnPromise).toBe('function')
   })

   test('instance should have methods: then, catch, finally', () => {

      expect(promise.then).toBeDefined()
      expect(promise.catch).toBeDefined()
      expect(promise.finally).toBeDefined()
   })

   test('should call executor function', () => {
      expect(executorSpy).toHaveBeenCalled()

   })

   test('should get data uim then block and chain them', async () => {
      const result = await promise.then(num => num).then(num => num * 2);
      expect(result).toBe(successResult * 2)
   })

   test('should catch error', () => {
      const errorExecutor = (_, reject) => t(() => reject(errorResult), 100)
      const errorPromise = new MyOwnPromise(errorExecutor)

      return new Promise(resolve => {
         errorPromise.catch(error => {
            expect(error).toBe(errorResult);
            resolve()
         })
      })
   })

   test('should call finally method', async () => {
      const finallySpy = jest.fn(() => {
      })
      await promise.finally(finallySpy)

      expect(finallySpy).toHaveBeenCalled()
   })
})

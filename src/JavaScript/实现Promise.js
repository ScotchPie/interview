/**
 * 实现Promise/A+
 */
class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  // 内部方法, 用于展开thenable对象
  static resolveThenable(val, onResolve, onReject) {
    if (
      typeof val === "function" ||
      (typeof val === "object" && val !== null)
    ) {
      let then;
      try {
        then = val.then;
      } catch (error) {
        onReject(error);
      }
      if (typeof then === "function") {
        let firstCall = true;
        try {
          then.call(
            val,
            (y) => {
              if (firstCall) {
                firstCall = false;
                MyPromise.resolveThenable(y, onResolve, onReject);
              }
            },
            (r) => {
              if (firstCall) {
                firstCall = false;
                onReject(r);
              }
            }
          );
        } catch (err) {
          onReject(err);
        }
      } else {
        onResolve(val);
      }
    } else {
      onResolve(val);
    }
  }

  // Promise.resolve
  static resolve(val) {
    if (val instanceof MyPromise) {
      return val;
    }

    if (
      typeof val === "function" ||
      (typeof val === "object" && val !== null)
    ) {
      let then;
      try {
        then = val.then;
      } catch (error) {
        return MyPromise.reject(error);
      }

      // val是thenable对象且then是函数时展开
      if (typeof then === "function") {
        return new MyPromise((resolve, reject) => {
          // 仿照[[Resolve]]抽象方法
          MyPromise.resolveThenable(val, resolve, reject);
        });
      }
    }

    return new MyPromise((resolve) => resolve(val));
  }

  // Promise.reject
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  // Promise.all(仅考虑数组输入)
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        if (promises.length === 0) {
          resolve(promises);
        }

        let result = [];

        promises.forEach((promise) => {
          MyPromise.resolve(promise).then((value) => {
            result.push(value);
            if (result.length === promises.length) {
              resolve(result);
            }
          }, reject);
        });
      } else {
        reject(new TypeError("Input value is not an array"));
      }
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        if (promises.length > 0) {
          promises.forEach((promise) => {
            MyPromise.resolve(promise).then(resolve, reject);
          });
        }
      } else {
        reject(new TypeError("Input value is not an array"));
      }
    });
  }

  constructor(executor) {
    this.status = MyPromise.PENDING;
    this.result = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.FULFILLED;
      this.result = value;
      this.onFulfilledCallbacks.forEach((cb) => {
        cb(value);
      });
    }
  }

  reject(reason) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.REJECTED;
      this.result = reason;
      this.onRejectedCallbacks.forEach((cb) => {
        cb(reason);
      });
    }
  }

  then(onFulfilled, onRejected) {
    let newPromise = new MyPromise((resolve, reject) => {
      switch (this.status) {
        case MyPromise.FULFILLED: {
          queueMicrotask(() => {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(this.result);
              } else {
                let x = onFulfilled(this.result);
                resolvePromise(newPromise, x, resolve, reject);
              }
            } catch (error) {
              reject(error);
            }
          });
          break;
        }

        case MyPromise.REJECTED: {
          queueMicrotask(() => {
            try {
              if (typeof onRejected !== "function") {
                reject(this.result);
              } else {
                let x = onRejected(this.result);
                resolvePromise(newPromise, x, resolve, reject);
              }
            } catch (error) {
              reject(error);
            }
          });
          break;
        }

        default: {
          this.onFulfilledCallbacks.push(() => {
            queueMicrotask(() => {
              try {
                if (typeof onFulfilled !== "function") {
                  resolve(this.result);
                } else {
                  let x = onFulfilled(this.result);
                  resolvePromise(newPromise, x, resolve, reject);
                }
              } catch (error) {
                reject(error);
              }
            });
          });
          this.onRejectedCallbacks.push(() => {
            queueMicrotask(() => {
              try {
                if (typeof onRejected !== "function") {
                  reject(this.result);
                } else {
                  let x = onRejected(this.result);
                  resolvePromise(newPromise, x, resolve, reject);
                }
              } catch (error) {
                reject(error);
              }
            });
          });
          break;
        }
      }
    });

    return newPromise;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onSettled) {
    return this.then(onSettled, onSettled);
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    throw new TypeError("Circular resolve");
  }

  if (typeof x === "function" || (typeof x === "object" && x !== null)) {
    let then;
    try {
      then = x.then;
    } catch (error) {
      reject(error);
    }

    if (typeof then === "function") {
      let firstCall = true;
      try {
        then.call(
          x,
          (y) => {
            if (firstCall) {
              firstCall = false;
              resolvePromise(promise, y, resolve, reject);
            }
          },
          (r) => {
            if (firstCall) {
              firstCall = false;
              reject(r);
            }
          }
        );
      } catch (error) {
        if (firstCall) {
          firstCall = false;
          reject(error);
        }
      }
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}

/** Promise测试代码 */
MyPromise.deferred = function () {
  let result = {};
  result.promise = new MyPromise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

module.exports = MyPromise;

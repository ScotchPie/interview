/**
 * 防抖函数
 * @param {*} fn
 * @param {*} delay
 * @returns
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param {*} fn
 * @param {*} delay
 * @returns
 */
function throttle(fn, delay) {
  let isCalled = false;
  return function (...args) {
    if (!isCalled) {
      fn.apply(this, args);
      isCalled = true;
      setTimeout(() => {
        isCalled = false;
      }, delay);
    }
  };
}

/**
 * 函数柯里化
 * @param {*} fn
 * @returns
 */
function currying(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return curried.bind(this, ...args);
    }
  };
}

/**
 * 数组扁平化
 * @param {*} arr
 * @returns
 */
function flatten(arr) {
  return arr.reduce(
    (prev, cur) => prev.concat(Array.isArray(cur) ? flatten(cur) : cur),
    []
  );
}

/**
 * 数组去重
 * @param {*} arr
 * @returns
 */
function dedup(arr) {
  return arr.reduce(
    (prev, cur) => (prev.includes(cur) ? prev : [...prev, cur]),
    []
  );
}

/**
 * 实现reduce方法
 * @param {*} fn
 * @param {*} initValue
 * @returns
 */
Array.prototype.myReduce = function (fn, initValue) {
  const hasInitialValue = initValue !== undefined;
  let result = hasInitialValue ? initValue : this[0];

  for (let i = hasInitialValue ? 0 : 1; i < this.length; i++) {
    result = fn(result, this[i], i, this);
  }

  return result;
};

/**
 * 实现call方法
 * @param {*} context
 * @param  {...any} args
 * @returns
 */
Function.prototype.myCall = function (context, ...args) {
  // context为null或undefined时被忽略
  context = context ?? window;
  const fn = Symbol("fn");
  context[fn] = this;
  const res = context[fn](...args);
  delete context[symbol];
  return res;
};

/**
 * 实现bind方法
 * @param {*} context
 * @param  {...any} args
 * @returns
 */
Function.prototype.myBind = function (context, ...args) {
  let fn = this;
  function fBound(...innerArgs) {
    fn.call(this instanceof fBound ? this : context, ...args, ...innerArgs);
  }
  fBound.prototype = Object.create(fn.prototype);
  return fBound;
};

/**
 * 模拟new操作符
 * @param {*} fn
 * @param  {...any} args
 * @returns
 */
function newCreate(fn, ...args) {
  const context = Object.create(fn.prototype);
  const res = fn.call(context, ...args);
  return Object.prototype.toString.call(res) === "[object Object]"
    ? res
    : context;
}

/**
 * 对象深拷贝
 * @param {*} obj
 * @param {*} cache
 * @returns
 */
function deepClone(obj, cache = new WeakMap()) {
  // 基础类型、函数类型不复制
  if (typeof obj !== "object" || obj === null) return obj;

  // 处理内置对象
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map) return new RegExp(Map);
  if (obj instanceof Set) return new RegExp(Set);
  // ...其余的内置对象不再列举

  // 处理数组和其他对象, 优先使用缓存避免循环引用
  if (cache.has(obj)) return cache.get(obj);
  const copy = new obj.constructor();

  // 添加缓存
  cache.set(obj, copy);

  Reflect.ownKeys(obj).forEach((key) => {
    copy[key] = deepClone(obj[key], cache);
  });

  return copy;
}

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
        MyPromise.reject(error);
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

        promises.forEach((promise, index) => {
          MyPromise.resolve(promise).then(
            (value) => {
              result[index] = value;
              if (result.length === promises.length) {
                resolve(result);
              }
            },
            (reason) => reject(reason)
          );
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

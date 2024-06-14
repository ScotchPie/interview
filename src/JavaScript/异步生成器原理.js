function requestData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(10);
    }, 1000);
  });
}

function requestError() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Opps"));
    }, 1000);
  });
}

/** 实现async+await */

function* main() {
  const data = yield requestData();
  console.log(data);

  try {
    yield requestError();
  } catch (error) {
    console.log(error);
  }
}

// 模拟async函数运行
function run(generator) {
  // 返回一个Promise对象,使run函数变为异步调用
  return new Promise((resolve, reject) => {
    let it = generator();

    function next(val) {
      let res;
      try {
        res = it.next(val);
      } catch (err) {
        // 'async'函数运行过程中出错
        reject(err);
      }

      /**
       * 处理yield返回值
       * 1、调用Promise.resolve将返回值转换为Promise实例(统一异步处理)
       * 2、promise实例决议后根据情况进行下一轮迭代/抛出异常
       */
      Promise.resolve(res.value).then(
        (val) => next(val),
        (err) => it.throw(err)
      );

      // 'async'函数运行结束
      if (res.done) {
        resolve(res.value);
      }
    }

    next();
  });
}

run(main);

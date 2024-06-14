function asyncFn() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(10), 1000);
  });
}

/** ES6生成器代码 */
function* main() {
  // 这里是状态1
  try {
    let tmp = asyncFn();
    // 这里是状态2
    let val = yield tmp;
    console.log(val);
  } catch (error) {
    // 这里是状态3
    console.log(error);
    return false;
  }
}

/** ES5版本 */
function main() {
  let state;

  function process(v) {
    switch (state) {
      case 1:
        return asyncFn();
      case 2: {
        let val = v;
        console.log(val);
        return;
      }
      case 3: {
        let err = v;
        console.log(err);
        return false;
      }
    }
  }

  return {
    next: function (v) {
      if (!state) {
        state = 1;
        return {
          done: false,
          value: process(),
        };
      } else if (state === 1) {
        state = 2;
        return {
          done: false,
          value: process(v),
        };
      } else {
        return {
          done: true,
          value: undefined,
        };
      }
    },
    throw: function (e) {
      if (state === 1) {
        state = 3;
        return {
          done: true,
          value: process(e),
        };
      } else {
        throw e;
      }
    },
  };
}

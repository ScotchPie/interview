function cury(fn) {
  return function curried(...args) {
    // 入参数量足够时，直接返回计算结果
    if (args.length >= fn.length) {
      return fn.call(this, ...args);
    }
    // 入参数量不足时，返回绑定好参数的新函数
    return curried.bind(this, ...args);
  };
}

function sum(a, b, c) {
  return a + b + c;
}

/** case 1 */
console.log("case 1", cury(sum)(1, 2, 3));

/** case 2 */
console.log("case 2", cury(sum)(1)(2)(3));

/** case 3 */
console.log("case 3", cury(sum)(1, 2)(3));

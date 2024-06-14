// 生成迭代器
function getIterator() {
  let prevVal;
  return {
    [Symbol.iterator]: function () {
      return getIterator();
    },
    next: function () {
      let nextVal = prevVal ? prevVal * 2 : 1;
      prevVal = nextVal;
      return {
        value: nextVal,
        // 最多运行10次
        done: nextVal === Math.pow(2, 10),
      };
    },
  };
}


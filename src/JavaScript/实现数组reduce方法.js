Array.prototype.myReduce = function (fn, initValue) {
  const hasInitialValue = initValue !== undefined;
  let result = hasInitialValue ? initValue : this[0];

  for (let i = hasInitialValue ? 0 : 1; i < this.length; i++) {
    result = fn(result, this[i], i, this);
  }

  return result;
};

/** case 1 */
const arr1 = [1, 2, 3];
const res1 = arr1.myReduce((prev, next) => prev + next);

console.log("case 1", res1);

/** case 2 */
const arr2 = [1, 2, 3];
const res2 = arr2.myReduce((prev, next) => prev + next, 10);

console.log("case 2", res2);

/** case 3 */
const arr3 = [];
const res3 = arr3.myReduce((prev, next) => prev + next, 0);

console.log("case 3", res3);

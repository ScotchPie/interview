Array.prototype.myMap = function (fn) {
  const newArr = [];
  for (let i = 0; i < this.length; i++) {
    newArr.push(fn(this[i], i, this));
  }
  return newArr;
};

/** case 1 */
const arr1 = [1, 2, 3];
const res1 = arr1.myMap((item, index, arr) => {
  return item * 2 + index + arr[0];
});

console.log("case 1", res1);

/** case 2 */
const arr2 = [];
const res2 = arr2.myMap((item, index) => {
  return item * 2 + index;
});

console.log("case 2", res2);

/** case 3 */
const arr3 = [1, undefined, null, 2];
const res3 = arr3.myMap((item, index) => {
  return item + index;
});

console.log("case 3", res3);

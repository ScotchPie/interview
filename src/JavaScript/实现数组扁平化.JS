function flattenArr(arr) {
  return arr.reduce(
    (acc, cur) => acc.concat(Array.isArray(cur) ? flattenArr(cur) : cur),
    []
  );
}

/** case 1 */
const arr1 = [1, 2, [3, 4], [5, [6, 7]]];
console.log("case 1", flattenArr(arr1));

/** case 2 */
const arr2 = [1, 2, [], [5, [6, 7]]];
console.log("case 2", flattenArr(arr2));

/** case 3 */
const arr3 = [];
console.log("case 3", flattenArr(arr3));

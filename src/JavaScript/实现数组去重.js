const arr = ["a", "b", "a", "b", "c", "e", "e", "c", "d", "d", "d", "d"];

// 使用 Set+Array.from() 实现
const res1 = Array.from(new Set(arr));

// 使用 Array.reduce() 实现
const res2 = arr.reduce((cur, item) => {
  if (!cur.includes(item)) {
    cur = [...cur, item];
  }
  return cur;
}, []);

console.log("method 1", res1);
console.log("method 2", res2);

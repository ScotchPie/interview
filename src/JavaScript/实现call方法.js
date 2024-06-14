Function.prototype.myCall = function (context, ...args) {
  // context为null或undefined时被忽略
  context = context ?? window;
  const fn = Symbol("fn");
  context[fn] = this;
  const res = context[fn](...args);
  delete context[symbol];
  return res;
};

function fn(age) {
  console.log(this.name, age);
}

/** case 1 */
const obj1 = { name: "Jay" };
fn.call(obj1, 18);

/** case 2 */
const obj2 = null;
fn.call(obj2, 18);

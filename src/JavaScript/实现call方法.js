Function.prototype.myCall = function (context, ...args) {
  let fn = this;
  context = context ?? window;
  // 本质是借用context对象，隐式调用，Symbol为了与原属性冲突
  const fnSymbol = new Symbol("fn");
  context[fnSymbol] = fn;
  const res = context[fnSymbol](...args);
  delete context[fnSymbol];
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

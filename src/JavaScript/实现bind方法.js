Function.prototype.myBind = function (context, ...args) {
  let fn = this;
  let fBound = function (...innerArgs) {
    return fn.call(
      // fBound可能作为构造函数被调用，构造出的对象的方法不能再被bind到其他context上
      // this instanceof fBound => 判断fBound是否被new调用
      this instanceof fBound ? this : context,
      ...args,
      ...innerArgs
    );
  };
  // this原型链上的方法不能丢失
  fBound.prototype = Object.create(fn.prototype);
  return fBound;
};

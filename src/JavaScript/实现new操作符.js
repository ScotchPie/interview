function createNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype);
  // 构造函数有可能返回对象
  const result = obj.call(obj, ...args);
  return Object.prototype.toString.call(result) === "[Object object]"
    ? result
    : obj;
}

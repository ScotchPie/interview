function deepCloneJsonSafe(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function deepClone(target, hash = new WeakMap()) {
  if (typeof target !== "object" || target === null) return target; // 处理原始类型和函数
  if (target instanceof Date) return new Date(target); // 处理日期
  if (target instanceof RegExp) return new RegExp(target); // 处理正则
  if (target instanceof Map) return new Map(target); // 处理Map
  if (target instanceof Set) return new Set(target); // 处理Set

  if (hash.has(target)) return hash.get(target); // 当需要拷贝当前对象时，先去存储空间中找，如果有的话直接返回
  const cloneTarget = new target.constructor(); // 创建一个新的克隆对象或克隆数组
  hash.set(target, cloneTarget); // 如果存储空间中没有就存进 hash 里

  // Reflect.ownKeys返回对象的字符串+Symbol类型的key
  Reflect.ownKeys(target).forEach((key) => {
    // WeakMap使得在一层拷贝完成后自动释放该层存储的作为key的对象
    // 如果用Map，在完成全部拷贝前，用来做key的对象都不会被释放，因为Map会持有对该对象的引用，直到最外层deepClone执行完成后才会释放
    cloneTarget[key] = deepClone(target[key], hash); // 递归拷贝每一层
  });
  return cloneTarget; // 返回克隆的对象
}

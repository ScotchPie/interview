let res = [];

function expensiveMapFn(data) {
  // 这里会进行一系列耗时操作
  return data;
}

// 数据批处理
function handleResponse(data) {
  // 数据分块
  let chunk = data.splice(0, 1000); // splice会返回被删除的元素
  res = res.concat(expensiveMapFn(chunk));

  // 剩下的数据留到下一个时间分片处理
  if (data.length > 0) {
    setTimeout(() => {
      handleResponse(data);
    }, 0);
  }
}

ajax("http://datasource.com", handleResponse);

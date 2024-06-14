/** 以下是主程序的代码 */
const worker = new Worker("script url");

// 从worker接收数据
worker.addEventListener("message", (e) => {
  console.log(e.data);
});

// 向worker发送数据
worker.postMessage("start your work");

// 终止worker
worker.terminate();

/** 以下是worker的代码 */
self.onmessage((ev) => {
  if (ev.data === "start your work") {
    let result;
    // do something here
    postMessage({ done: true, result });
  }
});

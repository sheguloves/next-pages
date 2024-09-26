# 服务端渲染（SSR） 之 Streaming

## 什么是SSR？

SSR（Server-Side Rendering）是一种在服务器端完成页面渲染的技术。在这种模式下，服务器接收到客户端的请求后，会先根据请求数据和模板文件生成完整的HTML页面，然后将这个页面直接发送给客户端。这样，用户可以直接看到完成的内容，无需等待JavaScript加载和执行。

## SSR 优点

- 更快的首屏加载：服务端渲染的 HTML 直接返回，无需等待javascript加载和数据异步加载。

- 更好的 SEO：搜索引擎爬虫可以直接看到完全渲染的页面, 没有额外的javascript加载执行逻辑和数据请求渲染逻辑。

- 更少的 ajax 数据请求: 服务器在返回页面时已经填充好了数据，不用再发送额外的请求获取数据

## SSR 缺点

- 服务器压力增大: 页面渲染在服务端完成，而不是使用静态服务器，增加了服务端的压力
- 调试困难: 相对于前后端分离的开发方式。调试会相对来说困难一点
- 开发限制: 对于传统的前端开发，有些页面state的维护相对来说需要换用别的方式，不过目前很多框架已经解决了这个问题，比如：Next.js 就支持 client component。

## SSR streaming

streaming 顾名思义就是通过流的方式返回 html 页面，基本原理如下

```js
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.write(
    "<!DOCTYPE html><html><head><title>Streaming</title></head><body>"
  );
  res.write("<div id='root'>这是root");
  res.write("</div></body></html>");
  setTimeout(() => {
    res.write(`
      <script>
        const dom = document.getElementById('root');
        dom.innerHTML = "这是替换部分";
      </script>
      `);
    res.end();
  }, 1000);
});

server.listen(8000);
```
上面的代码会先显示一个内容为 “这是root” 的页面，大约1秒种后，页面内容变化为 “这是替换部分”。

通过上面的代码可以看出，streaming 的加载方式就是先返回已经 stable 的 html 元素，不block用户的操作，后面再通过 script 的方式，追加异步逻辑。

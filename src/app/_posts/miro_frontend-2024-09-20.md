# 微前端概览

## 背景

考虑下面问题：
- 在开发一个大系统的时候，每个模块可能有不同的团队在开发，大家用的技术栈也可能不相同，如何将所有子模块整合到一个系统里，需要考虑。
- 大系统中，多个模块更新时间不一致，如何解决？
- 当一个系统有小变大时，想使用新的技术，同时又不想重写老的系统，或者没有资源重新老的系统，要怎么办？

## 什么是微前端

微前端是一种多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略。

## 微前端特点

- 技术栈无关。主系统框架不限制接入应用的技术栈，微应用具备完全自主权
- 开发独立，部署独立。每个微应用都可以作为独立的应用提供服务
- 增量升级。当在老的系统中想使用新技术时，可以通过微应用的方式做增量升级，而不用动老的系统
- 应用隔离。每个微应用状态相互隔离，运行时状态互不影响

## 微前端实现方式

### 微前端iframe

微前端的实现方式最容易想到的就是iframe。

#### 优点

- iframe 提供了完美的沙箱机制，不论是样式隔离、js 隔离这类问题统统都能被完美解决。

#### 缺点

- url 不同步。浏览器刷新iframe url状态丢失，后退前进按钮无法使用。
- UI 不同步，DOM 结构不共享。比如在iframe 中弹出一个对话框，它的位置是相对于iframe的，无法在当前应用中居中。
- 父子应用上下文隔离，内存变量不共享。父子通讯、数据同步、免登陆都需要解决。
- 加载速度慢。

### 微前端自定义加载方式

通过动态加载子应用的内容，动态渲染在主应用的元素中。

#### 优点

- UI 同步，DOM结构共享，可以解决子应用弹出窗口的问题
- url 同步，浏览器刷新后子应用状态不丢失，前进、后退功能完整
- 父子应用上下文共享，通讯方便，数据同步、免登录都容易实现

#### 缺点

- 上下文可能被修改，需要提供沙箱解决方案
- CSS 覆盖，需要提供样式隔离方案
- 父子应用使用同技术栈的情况下，资源重复加载

## 相关技术

使用自定义微前端加载方式，有许多技术细节需要自己实现，比如 CSS隔离，window 沙箱等。

### CSS 隔离

CSS 隔离目前比较常用的有两种方式，一种是 Scoped CSS，另外一种是 Shadow DOM 的方式。

#### Scoped CSS

Scoped CSS 实现方式是为微应用的style 和 class 上添加当前微应用的标识符，限制 CSS 的作用域

  ```js
  const host = document.querySelector("#host");
  const dataAttr = 'data-app';
  const miroAPPId = 'unique-miro-app-id';
  host.setAttribute(dataAttr, miroAPPId);

  const styleNodes = host.querySelectorAll('style') || [];
  if (styleNodes.length > 0) {
    const prefix = `[${dataAttr}=${miroAPPId}]`;
    const tempStyleNode = document.createElement('style');
    document.body.appendChild(tempStyleNode);
    styleNodes.forEach(node => {
      if (node.textContent) {
        const textNode = document.createTextNode(node.textContent || '');
        tempStyleNode.appendChild(textNode);
        const rules = Array.from(tempStyleNode.sheet.cssRules);
        let scopedCss = '';
        rules.forEach(rule => {
          const cssText = rule.cssText;
          scopedCss += cssText.replace(/^[\s\S]+{/, (selectors) => {
            return selectors.split(',').map(item => `${prefix} ${item}`).join(',')
          });
        });
        node.textContent = scopedCss;
        tempStyleNode.removeChild(textNode);
      }
    });
    document.body.removeChild(tempStyleNode);
  }
  ```
#### Shadow DOM

Shadow DOM 是浏览器默认支持的

  ```js
    const sheet = new CSSStyleSheet();
    sheet.replaceSync("span { color: red; border: 2px dotted black;}");

    const host = document.querySelector("#host");

    const shadow = host.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [sheet];
  ```

### Window 沙箱

Window 沙箱目前常见的有 **Proxy沙箱**, **快照沙箱**, **iframe沙箱**

#### Proxy 沙箱

Proxy沙箱是通过构造一个FakeWindow 作为代理，微应用的操作都在FakeWindow上操作，不污染主应用的window。

#### 快照沙箱

快照沙箱是在微应用创建时，将当前的快照存储下来，微应用销毁时，再恢复到之前的状态。

#### iframe 沙箱

iframe 沙箱是通过创建一个 iframe，将 iframe.contentWindow 作为微应用的window 对象。隔离性很好，天然支持。

#### 如何将沙箱注入微应用？

微应用打包成umd格式的library，包裹后的代码如下，那如何将我们的沙箱注入呢？

```js
  (function(root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        exports = factory();
    } else {
        root.umdModule = factory();
    }
  }(window, function() {
  }))
```

使用**快照沙箱**时，用的父应用的window，可以直接注入，不用做任何修改。

使用**Proxy 沙箱** 或者 **iframe 沙箱**时，window作为全局变量不能修改，可以通过外面包一层的方式实现

```js

  (wrapper(window, self, globalThis) {
    eval('/** miro application code **/');
  }).bind(sandbox)(sandbox, sandbox, sandbox)

```



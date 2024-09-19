# Javascript 之 History

## Background

HTML5引入了 **history.pushState()** 和 **history.replaceState()** 方法，它们分别可以添加和修改历史记录条目。这些方法通常与 **window.onpopstate** 配合使用。

前端导航的实现 History 类型的时间就是基于上面的这几个特性。Hash类型的前端导航则是基于**HashChangeEvent** 来实现

在移动开发过程中，H5 页面在 Mobile 操作时的前进、后退处理，也需要依赖于 **window.onpopstate** 来判断页面在不同状态下的加载还是使用缓存，从而提升用户体验

## History

Moving backward and forward through the user's history is done using the **back()**, **forward()**, and **go()** methods.

```js
window.history.back();    // the same like: window.history.go(-1)
window.history.forward(); // the same like: window.history.go(1)

// refresh current page
window.history.go(0);     // the same like: window.history.go();

// history stack
let numberOfEntries = window.history.length;
```

## History.pushState

使用 **history.pushState()** 可以改变 **referrer**，它在用户发送 **XMLHttpRequest** 请求时在 **HTTP** 头部使用，改变**state** 后创建的 **XMLHttpRequest** 对象的 **referrer** 都会被改变。因为 **referrer** 是标识创建  **XMLHttpRequest** 对象时 **this** 所代表的 **window** 对象中 **document** 的 **URL**。

假设在 **http://mozilla.org/foo.html** 中执行了以下 **JavaScript** 代码:

```js
let stateObj = {
    foo: "bar",
};

history.pushState(stateObj, "page 2", "bar.html");
```

这将使浏览器地址栏显示为 **http://mozilla.org/bar.html**，但并不会导致浏览器加载 **bar.html** ，甚至不会检查**bar.html** 是否存在。

**注意 *pushState()* 绝对不会触发 *hashchange* 事件，即使新的URL与旧的URL仅哈希不同也是如此。**

## History.replaceState

**history.replaceState()** 的使用与 **history.pushState()** 非常相似，区别在于 **replaceState()** 是修改了当前的历史记录项而不是新建一个。 注意这并不会阻止其在全局浏览器历史记录中创建一个新的历史记录项。

**replaceState()** 的使用场景在于为了响应用户操作，你想要更新状态对象 **state** 或者当前历史记录的 **URL**。

## popState Event

A **popstate** event is dispatched to the **window** each time the active history entry changes between two history entries for the same document. If the activated history entry was created by a call to **history.pushState()**, or was affected by a call to **history.replaceState()**, the popstate event's **state** property contains a copy of the history entry's state object.

**Calling *history.pushState()* or *history.replaceState()* won't trigger a popstate event**. The popstate event is only triggered by performing a browser action, such as clicking on the back button (or calling **history.back()** in JavaScript), when navigating between two history entries for the same document.

当网页加载时,各浏览器对 **popstate** 事件是否触发有不同的表现, Chrome 和 Safari会触发 **popstate** 事件, 而 Firefox 不会.

## 参考链接

- [WindowEventHandlers.onpopstate](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate)
- [Manipulating the browser history](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
# Javascript 之 Promise

## Promise只能进行异步操作
```js
var promise = new Promise(function (resolve){
    console.log("inner promise"); // 1
    resolve(42);
});
promise.then(function(value){
    console.log(value); // 3
});
console.log("outer promise"); // 2
```

从上面的打印结果来看，Promise只会以异步的方式调用回调函数。

原因：
> 同步调用和异步调用同时存在导致的混乱 - [Effective Javascript](http://effectivejs.com/)
>  - 绝对不能对异步回调函数（即使在数据已经就绪）进行同步调用。
>  - 如果对异步回调函数进行同步调用的话，处理顺序可能会与预期不符，可能带来意料之外的后果。
>  - 对异步回调函数进行同步调用，还可能导致栈溢出或异常处理错乱等问题。
>  - 如果想在将来某时刻调用异步回调函数的话，可以使用 setTimeout 等异步API。

```js
function onReady(fn) {
    var readyState = document.readyState;
    if (readyState === 'interactive' || readyState === 'complete') {
        fn();
    } else {
        window.addEventListener('DOMContentLoaded', fn);
    }
}
onReady(function () {
    console.log('DOM fully loaded and parsed');
});
console.log('==Starting==');
```

上面的代码的意图：
- 如果在调用onReady之前DOM已经载入的话，对回调函数进行同步调用
- 如果在调用onReady之前DOM还没有载入的话，通过注册 **DOMContentLoaded** 事件监听器来对回调函数进行异步调用

因此，如果这段代码在源文件中出现的位置不同，在控制台上打印的log消息顺序也会不同。

为了避免同时使用同步、异步调用可能引起的混乱问题，Promise在规范上规定 **Promise只能使用异步调用方式**

## 每次调用then都会返回一个新创建的promise对象

之前在使用**Angularjs 1.x**版本的时候，它内置了一个 **$q**，它是由[Kris Kowal's Q](https://github.com/kriskowal/q)得到的灵感，遵循[Promises/A+](https://promisesaplus.com/)规范的一个轻量实现。由于当时未深入了解，只是用了用，觉得用起来很舒服，但却没有深入了解，一直以为**then**回调函数中要手动的返回一个**Promise**对象，现在想来真的是连基本的使用都不懂，不禁汗颜。所以下面的写法是完全可以的

```js
var bPromise = new Promise(function (resolve) {
    resolve(100);
});
bPromise.then(function (value) {
    return value * 2;
}).then(function (value) {
    return value * 2;
}).then(function (value) {
    console.log("2: " + value); // => 100 * 2 * 2
});
```

不用手动的**return**一个**Promise**的对象，Promise的实现会帮我们自动将值转换为一个Promise对象。
也因为这个原因，所以下面的写法是不好的，或者被称为反模式

## **then**的错误用法

```js
function badAsyncCall() {
  var promise = Promise.resolve();
  promise.then(function() {
    throw new Error("error") // 无法在后续的then中捕获到，浏览器直接报错
  });
  return promise;
}

badAsyncCall().then(result => {
  console.log(result)
}).catch(err => {
  console.log(err)
})
// 打印 undefined
// 浏览器报错
```

这样写的问题在**promise.then**中如果出现错误，无法被外部捕获，同时也无法获取**then**的返回值，即使其由返回值。因为**then**会返回一个新的**promise**对象，所以我们可以用下面的写法来改善这种错误

```js
function anAsyncCall() {
  var promise = Promise.resolve();
  return promise.then(function() {
    throw new Error("error")  // 可以在后续的then中捕获到，浏览器正常
  });
}
badAsyncCall().then(result => {
  console.log(result)
}).catch(err => {
  console.log(err)
})
// 打印 Error: error at xxx.js
// 浏览器正常
```

## **Promise**集合

在开发过程中，我们经常会遇到这样的需求：一个页面有多个异步请求，希望这些请求按照顺序执行。一般遇到这样的情况，我们的做法是将这些请求按照顺序放到一个数组中，然后操作数组来实现。好处就是以后有新的请求要加入，那么我们只需要将对应的**Promise**按照要求的顺序放入数组中对应的位置就可以了，其他地方的代码不用动。如下面的示例代码：

```js
let promises = []
for (let i = 0; i < 5; i++) {
  promises.push(new Promise(function(resolve, reject) {
    setTimeout(() => {
      console.log("resolve" + i)
      resolve(i)
    }, (5 - i) * 1000) //时间由长到短，为的是查看执行顺序是否是正确的
  }))
}

function execCollectionByOrder(arr) {
  let exec = function(index) {
    if (index >= arr.length) {
      return
    }
    let promise = arr[index]
    return promise.then((result) => {
      console.log(result)
      return exec(index + 1)
    })
  }

  return exec(0)
}
execCollectionByOrder(promises)
// 打印结果
// resolve4
// resolve3
// resolve2
// resolve1
// resolve0
// 0
// 1
// 2
// 3
// 4
```

看来一切都是正常的。但是这样的写法用到了递归，而且不能清楚的看到调用链(其实我个人觉得这样挺直观^_^)。所以可以改进为下面的方式
```js
function execCollectionByOrder(arr) {
  return arr.reduce(function(promise, item) {
    return promise.then(function(result) {
      console.log(result)
      return item
    });
  }, Promise.resolve(-1));
}

execCollectionByOrder(promises).then(result => {
  console.log(result)
})
// 打印结果
// -1
// resolve4
// resolve3
// resolve2
// resolve1
// resolve0
// 0
// 1
// 2
// 3
// 4
```

为了让上面的写法看起来更像是顺序执行，我们可以改写为 **forEach** 的执行方式
```js
let promise = Promise.resolve()
promises.forEach(item => {
  promise = promise.then((value) => {
    return item
  }).then(result => {
    console.log(result)
  })
})
```

上面的写法是使用**Promise.then**会返回一个**Promise**对象的特点，从而做到链式调用

## **then** vs **catch**

一般来说，**.catch** 也可以理解为 **promise.then(undefined, onRejected)**，但他们在使用中需要注意一下，以免造成错误

```js
function throwError(value) {
  // 抛出异常
  throw new Error(value);
}
// <1> onRejected不会被调用
function badMain(onRejected) {
  return Promise.resolve(42).then(throwError, onRejected); // 浏览器报错，onRejected没有捕获到throwError里面的错误
}
// <2> 有异常发生时onRejected会被调用
function goodMain(onRejected) {
  return Promise.resolve(42).then(throwError).catch(onRejected);
}
// 运行示例
badMain(function(){
  console.log("BAD");
});
goodMain(function(){
  console.log("GOOD");
});
```

所以我们需要换一种写法来保证上面所有的错误被捕获

```js
function badMain(onRejected) {
  return Promise.resolve(42).then(throwError).then(null, onRejected)
}

// 用 catch 意图会更明显，代码也更清晰
function badMain(onRejected) {
  return Promise.resolve(42).then(throwError).catch(onRejected)
}
```

### 小结

- 使用 **promise.then(onFulfilled, onRejected)** 的话
  - 在 **onFulfilled** 中发生异常的话，在 **onRejected** 中是捕获不到这个异常的。
- 在 **promise.then(onFulfilled).catch(onRejected)** 的情况下
  - **then** 中产生的异常能在 **.catch** 中捕获
- **.then** 和 **.catch** 在本质上是没有区别的, 需要分场合使用。


关于这些反模式，详细内容可以参考 [Promise Anti-patterns](http://taoofcode.net/promise-anti-patterns/)

## 使用 **reject** 而不是 **throw**

**Promise** 的构造函数，以及被 **then** 调用执行的函数基本上都可以认为是在 **try...catch** 代码块中执行的，所以在这些代码中即使使用 **throw** ，程序本身也不会因为异常而终止。

```js
var promise = new Promise(function(resolve, reject){
    throw new Error("message");
    // reject(new Error("message"));
});
promise.catch(function(error){
    console.error(error); // => "message"
    console.log("bbb")    // 控制台会打印出 bbb，程序继续运行
});

// 改写为下面的方式，意思更清晰，也避免了代码其他类型错误的混淆
var promise = new Promise(function(resolve, reject){
    reject(new Error("message"));
});
promise.catch(function(error){
    console.error(error);// => "message"
})
```

为了与程序代码中其他错误不混淆，我们可以对代码再封装一下，通过 **reject** 来控制会更清楚的表达意思
```js
var onRejected = console.error.bind(console);
var promise = Promise.resolve();
promise.then(function () {
    var retPromise = new Promise(function (resolve, reject) {
       reject(new Error("this promise is rejected"));
    });
    return retPromise;
}).catch(onRejected);

// 简化为下面的方式
var onRejected = console.error.bind(console);
var promise = Promise.resolve();
promise.then(function () {
    return Promise.reject(new Error("this promise is rejected"));
}).catch(onRejected);
```

### 小结

- 使用 **reject** 会比使用 **throw** 安全
- 在 **then** 中使用 **reject** 的方法

## JavaScript 异常和 **Promise**

由于Promise的try-catch机制，有些代码层面的问题可能会被内部消化掉。 如果在调用的时候每次都无遗漏的进行 catch 处理的话当然最好了，但是如果在实现的过程中出现了下面例子中的错误的话，那么进行错误排除的工作也会变得困难。

这种错误被内部消化的问题也被称为 unhandled rejection ，从字面上看就是在Rejected时没有找到相应处理的意思。

```js
var jsonPromise = new Promise(function(resolve, reject) {
  // JSON.parse throws an error if you feed it some
  // invalid JSON, so this implicitly rejects:
  resolve(JSON.parse("This ain't JSON"));
});

jsonPromise.then(function(data) {
  // This never happens:
  console.log("It worked!", data);
}).catch(function(err) {
  // Instead, this happens:
  console.log("It failed!", err);
})
```

如果你使用过其他的 **Promise** 实现类库的话，可能见过用 **done** 代替 **then** 的例子。
这些类库都提供了 **Promise.prototype.done** 方法，使用起来也和 **then** 一样，但是这个方法并不会返回 **promise** 对象。
在 **Promise** 中 **done** 是怎么解决上面提到的错误被忽略呢？ 其实它的方法很简单直接，那就是必须要进行错误处理

```js
if (typeof Promise.prototype.done === "undefined") {
    Promise.prototype.done = function (onFulfilled, onRejected) {
        this.then(onFulfilled, onRejected).catch(function (error) {
            setTimeout(function () {
                throw error;
            }, 0);
        });
    };
}
```
那么它是如何将异常抛到 **Promise** 的外面的呢？其实这里我们利用的是在 **setTimeout** 中使用 **throw** 方法，直接将异常抛给了外部。
```js
try {
    setTimeout(function callback() {
        throw new Error("error"); // 这个error不会被catch到，异常会抛向全局然后 `window.onerror` 可以将其捕获
    }, 0);
} catch(error) {
    console.error(error);
}
```

再看下面的这个对比
```js
function fetch(callback) {
    return new Promise((resolve, reject) => {
        throw Error('用户不存在')
    })
}

fetch().then(result => {
    console.log('请求处理', result) // 永远不会执行
}).catch(error => {
    console.log('请求处理异常', error) // 请求处理异常 用户不存在
})
```

```js
function fetch(callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
             throw Error('用户不存在')
             // reject('用户不存在')  // 请使用 reject 来保证promise可以正常捕获到异常
        })
    })
}

fetch().then(result => {
    console.log('请求处理', result) // 永远不会执行
}).catch(error => {
    console.log('请求处理异常', error) // 永远不会执行
})

// 程序崩溃
// Uncaught Error: 用户不存在
```

由上面的代码可以看出，在处理异步异常的时候，需要注意处理方式，也更加说明使用 reject 是比 throw 更好的方式

### 小结

- 虽然 **Promise** 有强大的错误处理机制，但是我们在写代码的过程中也要时时关注 **catch** 中的错误，以免漏掉错误
- 想要处理异步错误，需要将 **try...catch** 放到异步回调函数内，例如：将 **try...catch** 放入 **setTimeout** 的处理函数内，而不是包装在外面

## Deferred vs Promise

先看一下通过 **Promise** 来实现的 **Deferred**

```js
function Deferred() {
    this.promise = new Promise(function (resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
    }.bind(this));
}
Deferred.prototype.resolve = function (value) {
    this._resolve.call(this.promise, value);
};
Deferred.prototype.reject = function (reason) {
    this._reject.call(this.promise, reason);
};
function getURL(URL) {
    var deferred = new Deferred();
    var req = new XMLHttpRequest();
    req.open('GET', URL, true);
    req.onload = function () {
        if (req.status === 200) {
            deferred.resolve(req.responseText);
        } else {
            deferred.reject(new Error(req.statusText));
        }
    };
    req.onerror = function () {
        deferred.reject(new Error(req.statusText));
    };
    req.send();
    return deferred.promise;
}
// 运行示例
var URL = "http://httpbin.org/get";
getURL(URL).then(function onFulfilled(value){
    console.log(value);
}).catch(console.error.bind(console));
```

由上面的代码可以看出，**Deferred** 和 **Promise** 并不是处于竞争的关系，而是 **Deferred** 内涵了 **Promise**

在使用 **Promise** 的时候，需要在构造函数中写入对 **resolve** 和 **reject** 的处理，而使用 **Deferred** 的话，并不需要将处理逻辑写成一大块代码，只需要先创建 **deferred** 对象，可以在任何时机对 **resolve、reject** 方法进行调用。

换句话说，**Promise** 代表了一个对象，这个对象的状态现在还不确定，但是未来一个时间点它的状态要么变为正常值（FulFilled），要么变为异常值（Rejected）；而 **Deferred** 对象表示了一个处理还没有结束的这种事实，在它的处理结束的时候，可以通过 **Promise** 来取得处理结果。

## **Promise.race** 实现超时处理

```js
function delayPromise(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
function timeoutPromise(promise, ms) {
    var timeout = delayPromise(ms).then(function () {
            throw new Error('Operation timed out after ' + ms + ' ms');
        });
    return Promise.race([promise, timeout]);
}
// 运行示例
var taskPromise = new Promise(function(resolve){
    // 随便一些什么处理
    var delay = Math.random() * 2000;
    setTimeout(function(){
        resolve(delay + "ms");
    }, delay);
});
timeoutPromise(taskPromise, 1000).then(function(value){
    console.log("taskPromise在规定时间内结束 : " + value);
}).catch(function(error){
    console.log("发生超时", error);
});

```
结合 **XHR** 中的 **abort** 方法，可以做到 **ajax** 请求超时取消

## Promise API

### Promise.resolve

根据接收到的参数不同，返回不同的promise对象。虽然每种情况都会返回promise对象，但是大体来说主要分为下面3类。

- 接收到 promise 对象参数的时候
  - 返回的还是接收到的 promise 对象
- 接收到 thenable 类型的对象的时候
  - 返回一个新的 promise 对象，这个对象具有一个 then 方法
- 接收的参数为其他类型的时候（ 包括 JavaScript 对或 null 等 ）
  - 返回一个将该对象作为值的新 promise 对象

### Promise.reject
- 即使 Promise.reject 接收到的参数是一个 promise 对象，该函数也还是会返回一个全新的 promise 对象

### Promise.race
- 生成并返回一个新的promise对象。
- 参数 promise 数组中的任何一个 promise 对象如果变为 resolve 或者 reject 的话， 该函数就会返回，并使用这个**promise对象的值**进行 resolve 或者 reject


## 参考链接
- [Javascript Promise 迷你书](http://liubin.org/promises-book/)
# Partila Function and currying

## Partial Application (Partial Function Application)

[定义](https://en.wikipedia.org/wiki/Partial_application)：
> In computer science, partial application (or partial function application) refers to the process of fixing a number of arguments to a function, producing another function of smaller arity.

Partially applying a function means creating a new function by pre-filling some of the arguments to the original function.

看下面的示例
```js
const add = function(a, b, c) {
  return a + b + c
}

let addOne = add.bind(null, 1)
let addThree = addOne.bind(null, 2) // 等价于 let addThree = add.bind(null, 1, 2)

addThree(3) // 6
```

上面的代码中，在调用的时候只需要传一个参数，在之前的[Javascript 基础之 Bind](https://github.com/sheguloves/blog/issues/18) 中详细介绍了 **bind** 的用法，所以用 **bind** 来实现偏函数是一个比较简单的方式。

下面我们提供一个更加通用的实现方法

```js
const add = function(a, b, c) {
  return a + b + c
}

function partial(fn, ...args) {
  return function() {
    return fn(...args, ...arguments)
  }
}

let addOne = partial(add, 1)
addOne(2, 3) // 6
let addThree = partial(add, 1, 2)
addThree(3) // 6

```

## Currying

[定义](https://en.wikipedia.org/wiki/Currying)：
>In mathematics and computer science, currying is the technique of translating the evaluation of a function that takes multiple arguments into evaluating a sequence of functions, each with a **single** argument.

```js
// add = a => b => Number
const add = a => b => a + b;
const result = add(2)(3); // => 5
```

下面的代码是在[JavaScript专题之函数柯里化](https://github.com/mqyqingfeng/Blog/issues/42)中看到的一个牛人写的方法，让我们特别清楚的理解 **Curry** 的原理与实现，特此记录在这个地方，以供以后不时拿来盘盘

```js
var curry = fn => {
  judge = (...args) => {
    args.length === fn.length
        ? fn(...args)
        : (arg) => judge(...args, arg)
  }
}
```

## 作用
- 参数复用

  从上面的例子中不难看出，参数复用或者叫绑定部分参数，**Partial** 和 **Currying** 都有这样的功能。从上面的例子中，我们可以看到，通过 Partial 或者 Currying 返回的函数，实际上是把之前的参数通过闭包的方式保留了下来，在真正执行的时候再拿到，从而实现复用的效果

- 提前返回

  上面的例子中也体现了这部分的作用，但是具体在使用中，在什么情况下需要提前返回呢？看下面的代码
  ```js
  var addEvent = function(el, type, fn, capture) {
      if (window.addEventListener) {
          el.addEventListener(type, function(e) {
              fn.call(el, e);
          }, capture);
      } else if (window.attachEvent) {
          el.attachEvent("on" + type, function(e) {
              fn.call(el, e);
          });
      }
  }
  ```
  当调用 **addEvent** 的时候，每次 **if...else** 都需要判断一遍，改成下面的方式实际上就是提前返回
  ```js
  var addEvent = (function(){
      if (window.addEventListener) {
          return function(el, sType, fn, capture) {
              el.addEventListener(sType, function(e) {
                  fn.call(el, e);
              }, (capture));
          };
      } else if (window.attachEvent) {
          return function(el, sType, fn, capture) {
              el.attachEvent("on" + sType, function(e) {
                  fn.call(el, e);
              });
          };
      }
  })();
  ```
  当然，上面的代码只是为了说明作用，做演示用，我们在真正开发过程中其实可以不用立即执行函数，从而使代码更直观。

- 延迟执行

  其实从上面的代码中，我们可以看到，不论是 **Partial** 还是 **Currying**，实际上都是将一些参数保留下来，最后才最真正的计算。但是实际的作用是什么呢？其实通过我们之前用 bind 的实现可以了解一二。 **bind** 的作用实际上是提前改变函数上下文，延迟执行，通过这个例子是不是就容易理解了

## 参考链接

- [Functional Programming Jargon](https://github.com/hemanth/functional-programming-jargon#partial-application)
- [JavaScript专题之函数柯里化](https://github.com/mqyqingfeng/Blog/issues/42)
- [JS中的柯里化(currying)](https://www.zhangxinxu.com/wordpress/2013/02/js-currying/)
# Javascript 之 Bind

## 定义
**bind()**函数会创建一个新的函数，当新的函数被调用的时候，函数中的**this**会指向**bind**提供的值，并将**bind**中的后续参数放在函数调用时提供参数的前面

## 语法

```function.bind(thisArg[, arg1[, arg2[, ...]]])```

## 使用方式

### 普通方式

```js
var x = 9;    // this refers to global "window" object here in the browser
var module = {
  x: 81,
  getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX(); // 9
```

### 偏函数用法一

```js
function list() {
  return Array.prototype.slice.call(arguments);
}

function addArguments(arg1, arg2) {
    return arg1 + arg2
}

var list1 = list(1, 2, 3); // [1, 2, 3]
var result1 = addArguments(1, 2); // 3

// Create a function with a preset leading argument
var leadingThirtysevenList = list.bind(null, 37);

// Create a function with a preset first argument.
var addThirtySeven = addArguments.bind(null, 37);

var list2 = leadingThirtysevenList();         // [37]

var list3 = leadingThirtysevenList(1, 2, 3);  // [37, 1, 2, 3]
```

### 绑定constructor - 偏函数用法

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function() {
  return this.x + ',' + this.y;
};

var p = new Point(1, 2);
p.toString(); // '1,2'
var YAxisPoint = Point.bind(null, 0/*x*/);

var axisPoint = new YAxisPoint(5);
axisPoint.toString(); // '0,5'
```
结果就是**x**的值一直是0，也许是一种封装类的方式，这样可以封装三方类，提供一个固定属性某些属性值的类，也许有特殊的地方可以使用

### 偏函数用法三
有时候，我们在写函数的时候，为了抽象出更高层的用法，一般会将函数、函数参数都做为参数，传递给高级函数调用，如下面的用法，我们需要有一个**jonsParse**的函数来处理**XHR**请求返回回来的**json**数据

```js
function jsonParse(callback, error, response) {
  if (error) {
    callback(error, response);
  } else {
    try {
      var result = JSON.parse(response);
      callback(null, result);
    } catch (e) {
      callback(e, response);
    }
  }
}

ajax('http://xxx.com/test.json', jsonParse.bind(null, callback));

```

上面的写法其实就等价于

```js
jsonParse.bind(null, callback)
// 等价于
function bindJSONParse(error, response){
  jsonParse(callback, error, response);
}
```
在使用**jsonParse**函数的时候我们使用了**bind**进行绑定，通过使用这种偏函数（Partial Function）的方式就可以减少匿名函数的使用。

## Polyfill

下面是MDN上给的一个Ployfill的实现

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
          return fToBind.apply(this instanceof fBound
                 ? this
                 : oThis,
                 // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 维护原型关系
    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype;
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP();

    return fBound;
  };
}
```

可以看到**bind**内部调用的apply，而**bind**后返回的函数由于闭包的原因，定死了**this**的值，由此可以得出，**bind**链式调用多次不会起作用，只会使用第一次**bind**的值做为函数内部的**this**。

如下面代码演示：
```js
let aa = {
  name: "aa",
}
let bb = {
  name: 'bb',
}
function xx() {
  console.log(this.name)
}
let funcaa = xx.bind(aa)
let funcbb = xx.bind(aa).bind(bb)
funcaa() // aa
funcbb() // aa
```

同时，由上面的 Polyfill 也可以看到，bind 会将调用时的参数也放在内存中，如果 bind 中的参数是复杂对象，则传入的是引用，看下面代码理解一下
```js
function recordValue(results, value) {
    results.push(value);
    return results;
}
// [] 用来保存结果
var pushValue = recordValue.bind(null, []);
console.log(pushValue(1))
console.log(pushValue(2))
console.log(pushValue(3))

// [1]
// [1, 2]
// [1, 2, 3]
```

由上面的结果我们可以知道，**[]** 在 bind 后一直由 bind 返回的包装函数引用，每次调用函数后，都会修改 **[]** 中的值，所以如果全局函数中有这样的实现，会不会造成内存泄漏呢？以后有机会验证一下。

## 参考链接

- [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [Javascript Promise迷你书](http://liubin.org/promises-book/)
- [深入浅出妙用 Javascript 中 apply、call、bind](http://web.jobbole.com/83642/)
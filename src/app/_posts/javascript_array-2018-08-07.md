# Javascript 之 Array

```js
var a = new Array(3);
// 等价为 a = []; a.length = 3;
```
这种创建方式与下面的创建方式是不一样的

```js
var b = [undefined, undefined, undefined];

a[2] // undefined
b[2] // undefined
a[2] === b[2] // true
```

a 在 chorme console 中显示为 [udnefined x 3]，b 显示为 [undefined, undefined, undefined]，因为在 a 中实际上并不存在任何单元

```js
a.join( "-" ); // "--"
b.join( "-" ); // "--"

a.map(function(v,i){ return i; }); // [ undefined x 3 ]
b.map(function(v,i){ return i; }); // [ 0, 1, 2 ]
```

为什么会这样呢，要看看 join 和 map 的实现方式：

```js
function fakeJoin(arr,connector) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        if (i > 0) {
            str += connector;
        }
        if (arr[i] !== undefined) {
            str += arr[i];
        }
    }
    return str;
}

Array.prototype.map = function(fun /*, thisp*/) {
    var len = this.length;
    if (typeof fun != "function") {
        throw new TypeError();
    }

    // 重点
    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
        // 重点，同 map 类似，filter/some/every/forEach 都会有下面这个判断，由于 some/every/forEach 不会动原数组，
        // 所以对于"空单元数组"来说，只是空跑了一遍循环，什么都没做，而 filter 是要返回一个过滤后的数组，
        // 所以会创建一个 length 为 0 的数组, 结果就是这个空数组
        if (i in this) {
            res[i] = fun.call(thisp, this[i], i, this);
        }
    }

    return res;
};

```

我们可以通过下述方式来创建包含 undefined 单元(而非“空单元”)的数组:

```js
var a = Array.apply( null, { length: 3 } );
a; // [ undefined, undefined, undefined ]
var b = Array.from( { length: 3 } );
b; // [ undefined, undefined, undefined ]
```

**Array.apply(..)** 调用 **Array(..)** 函数，并且将 **{ length: 3 }** 作为函数的参数。 我们可以设想 **apply(..)** 内部有一个 for 循环(与上述 **join(..)** 类似)，从 0 开始循环到 **length** (即循环到 2，不包括 3)。
假设在 **apply(..)** 内部该数组参数名为 **arr**，**for** 循环就会这样来遍历数组: **arr[0]**、**arr[1]**、**arr[2]**。然而，由于**{ length: 3 }** 中并不存在这些属性，所以返回值为 **undefined**。
换句话说，我们执行的实际上是 **Array(undefined, undefined, undefined)**，所以结果是单元值为 **undefined** 的数组，而非空单元数组。
虽然 **Array.apply( null, { length: 3 } )** 在创建 **undefined **值的数组时有些奇怪和繁琐， 但是其结果远比 **Array(3)** 更准确可靠。

Array.from 的 polyfill, 去掉了一些复杂的代码，只留下了核心部分

```js
if (!Array.from) {
    Array.from = (function () {
        return function from(arrayLike/*, mapFn, thisArg */) {
            var len = arrayLike.length;
            var A = new Array(len);
            var k = 0;
            var kValue;
            while (k < len) {
                kValue = items[k];
                A[k] = kValue;
                k += 1;
            }
            A.length = len;
            return A;
        };
    }());
}
```
总之，永远不要创建和使用空单元数组。

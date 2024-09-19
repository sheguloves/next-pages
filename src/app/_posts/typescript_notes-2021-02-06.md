# Typescript 碎碎念

- Array.forEach 在大数据量的情况下为什么性能可能有问题，是因为Array.forEach在遍历的过程中不会缓存数组的长度，导致每次都需要访问原数组来获取长度。在大数据的情况下可能会有性能问题。Lodash的 forEach对数组长度做了缓存，所以性能优于Array.forEach. Array.forEach中途无法跳出循环，只能通过try…catch的方式，在循环中通过throw error来跳出循环。

- 如何获取浏览器的刷新率。可以通过window.requestAnimationFrame 来计算得出。

- xmlRequest 如何取消。xmlRequest有原生的abort方法，可以取消请求。

- Async 和 promise的区别。Async 实际上是 promise的语法糖，要获取 Async 的error可以通过try… catch的方式。

- New 操作符做了哪些事情
    1. 创建一个空对象
    2. 将对象的prototype指向构造函数的prototype
    3. 将空对象作为构造函数的上下文（改变this指向）
    4. 对构造函数有返回值的处理判断

    ```jsx
    function Test() {
    	this.name = 'aaa';
    	// 如果返回值为基础类型，则忽略，返回this对象。
    	// 返回值为 { name: 'aaa' }
    	return 111;
    	// 如果返回值为对象，则返回这个对象
    	// 返回值为 {}
    	return {};
    }

    // 自己实现 New 操作
    function createInstance(fn, ...args) {
    	var obj = {};
    	Object.setPrototypeOf(obj, fn.prototype);
    	var result = fn.apply(obj, args);
    	if (result instanceOf Object) {
    		return result;
    	} else {
    		return obj;
    	}
    }
    ```

- javascript 继承有哪些方式
    1. ES6 class 继承
    2. 原型链继承

        ```jsx
        function Parent() {}
        function Child() {}
        Child.prototype = new Parent();
        ```

    3. 构造函数继承

        ```jsx
        function Parent() {}
        function Child() {
        	Parent.call(this)
        }
        ```

    4. 组合继承 -》 2 + 3 两个组合
- 函数中 this 是什么

    ```jsx
    var name = '111';
    var obj1 = {
      name: 'obj1',
      say: function() {
        console.log(this.name);
      }
    };
    obj1.say(); // obj1
    var res = obj1.say;
    res(); // 111
    var obj2 = {
      name: 'obj2',
      say: function(fn) {
       fn();
      }
    };
    obj2.say(obj1.say); // 111
    obj2.say = obj1.say;
    obj2.say();  // obj2

    var obj3 = {
      name: 'obj3',
      say: function() {
       (function() {
        console.log(this.name);
       })()
      }
    };
    obj3.say(); // 111

    // 打印结果
    obj1
    111
    111
    obj2
    111
    ```

    由上面的结果可以得出，立即执行函数的this是指向window的
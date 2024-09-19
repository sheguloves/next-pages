# Vue Notes

## ref 和 reactive 的区别

- ref 既可以作用于简单类型数据（string，number，boolean），也可以作用于对象
- reactive 只可以作用在对象上，因为reactive内部是用proxy封装，proxy只可以作用在对象上
- ref 用在需要改变整个值时，reactive返回的是proxy包装后的对象，改变引用时会丢失原引用

    ```typescript

    const ref1 = ref(null);
    ref.value = await getData(); // 正常触发视图更新

    const reactive1 = reactive({});
    reactive1 = await getDate(); // 引用改变，原来的reactive 对象丢失，不会触发视图更新

    ```

## 在哪个生命周期中进行数据请求？

在Vue的组件初始化的过程中，会依次执行钩子函数：beforeCreated，created，beforeMount，mounted。无论**异步数据请求**放在哪个钩子函数中，都会在这4个钩子函数执行结束后才返回结果，所以异步数据请求放在哪个钩子函数中都是可以的。那是不是就可以随便放了呢？

如果这个数据请求是封装在一个函数中的，只要这个函数不是类组件的内部方法，就可以随便放。因为，如果是类组件的内部方法，beforeCreated 钩子函数执行时，类的内部方法和data属性还没有初始化，所以就拿不到对应的实例方法，就会报错。

所以还是建议大家把数据请求的调用放在其他钩子函数中，这样就能完全避免这个错误。
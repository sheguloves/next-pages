# Vue Notes

### ref 和 reactive 的区别

- ref 既可以作用于简单类型数据（string，number，boolean），也可以作用于对象
- reactive 只可以作用在对象上，因为reactive内部是用proxy封装，proxy只可以作用在对象上
- ref 用在需要改变整个值时，reactive返回的是proxy包装后的对象，改变引用时会丢失原引用

    ```typescript

    const ref1 = ref(null);
    ref.value = await getData(); // 正常触发视图更新

    const reactive1 = reactive({});
    reactive1 = await getDate(); // 引用改变，原来的reactive 对象丢失，不会触发视图更新

    ```

- 为什么不建议在beforeCreated 生命周期中做数据请求？因为数据请求方法有可能是类组件内部的方法，beforeCreated 生命周期中是没有初始化这个方法的，调用会报错。
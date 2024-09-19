# Vue 2的异步更新

上一节 [VUE2.0 - 数据双向绑定](https://sheguloves.github.io/next-pages/posts/vue2_databinding-2018-05-31.md) 读了**vue**基本的数据双向绑定原理代码，这节看看数据变化后，异步更新dom的逻辑


先看看数据变化时，更新数据的代码入口

## **vue/src/observer/index.js**

```js
/**
 * Define a reactive property on an Object.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 */

export function defineReactive(obj, key, val) {
    var dep = new Dep()

    var property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get
    var setter = property && property.set

    var childOb = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            var value = getter ? getter.call(obj) : val
            if (Dep.target) {
                dep.depend()
                if (childOb) {
                    childOb.dep.depend()
                }
                if (isArray(value)) {
                    for (var e, i = 0, l = value.length; i < l; i++) {
                        e = value[i]
                        e && e.__ob__ && e.__ob__.dep.depend()
                    }
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            var value = getter ? getter.call(obj) : val
            // value值没有变化时，则return
            if (newVal === value) {
                return
            }
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            // 递归的对当前的newVal做监听拦截，以做到value为object对象的情况下，
            // 直接替换对象仍然可以监听到数据变化
            childOb = observe(newVal)
            // dep通知所有的watcher更新（这就是今天要读的逻辑的代码入口）
            dep.notify()
        }
    })
}
```

接下来看看**dep.notify()**的逻辑

## **vue/src/observer/dep.js**

```js
Dep.prototype.notify = function() {
    // stablize the subscriber list first
    var subs = this.subs.slice()
    for (var i = 0, l = subs.length; i < l; i++) {
        // 执行所有的watcher.update函数，完成监听者的更新
        subs[i].update()
    }
}
```

看看**watcher.update()**的逻辑

## **vue/src/observer/watcher.js**
```js
/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 *
 * @param {Boolean} shallow
 */

Watcher.prototype.update = function(shallow) {
    if (this.lazy) {
        // 如果是lazy的话，只标记为dirty，不做任何操作
        this.dirty = true
    } else if (this.sync || !config.async) {
        // 如果是sync的话，直接run，也就是直接执行watcher的callback进行dom更新
        this.run()
    } else {
        // if queued, only overwrite shallow with non-shallow,
        // but not the other way around.
        this.shallow = this.queued ?
            shallow ?
            this.shallow :
            false :
            !!shallow
        this.queued = true
        // record before-push error stack in debug mode
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && config.debug) {
            this.prevError = new Error('[vue] async stack trace')
        }
        pushWatcher(this)
    }
}

```

从上面代码中可以看到，默认行为是**pushWatcher(this)**，看看它里面做了什么事情

## **vue/src/observer/batcher.js**

```js
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 *
 * @param {Watcher} watcher
 *   properties:
 *   - {Number} id
 *   - {Function} run
 */

export function pushWatcher(watcher) {
    var id = watcher.id
    if (has[id] == null) {
        if (internalQueueDepleted && !watcher.user) {
            // an internal watcher triggered by a user watcher...
            // let's run it immediately after current user watcher is done.
            userQueue.splice(queueIndex + 1, 0, watcher)
        } else {
            // push watcher into appropriate queue
            var q = watcher.user ?
                userQueue :
                queue
            has[id] = q.length
            q.push(watcher)
            // queue the flush
            if (!waiting) {
                waiting = true
                nextTick(flushBatcherQueue)
            }
        }
    }
}
```

上面代码的注释已经解释很清楚了，看看nextTick的逻辑

## **vue/src/util/env.js**

```js
/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */

export const nextTick = (function() {
    var callbacks = []
    var pending = false
    var timerFunc

    function nextTickHandler() {
        pending = false
        var copies = callbacks.slice(0)
        callbacks = []
        for (var i = 0; i < copies.length; i++) {
            copies[i]()
        }
    }

    // 如果当前环境支持Mutatuion Observer，则通过Mutation Oberver进行异步更新,
    // 方式是创建一个text节点，通过更新text节点的内容，出发Mutation Oberver的回掉函数，
    // 否则调用setImmediate／setTimeout做到异步更新
    if (typeof MutationObserver !== 'undefined') {
        var counter = 1
        var observer = new MutationObserver(nextTickHandler)
        var textNode = document.createTextNode(counter)
        observer.observe(textNode, {
            characterData: true
        })
        timerFunc = function() {
            counter = (counter + 1) % 2
            textNode.data = counter
        }
    } else {
        // webpack attempts to inject a shim for setImmediate
        // if it is used as a global, so we have to work around that to
        // avoid bundling unnecessary code.
        const context = inBrowser ?
            window :
            typeof global !== 'undefined' ? global : {}
        timerFunc = context.setImmediate || setTimeout
    }
    return function(cb, ctx) {
        var func = ctx ?
            function() { cb.call(ctx) } :
            cb
        callbacks.push(func)
        if (pending) return
        pending = true
        timerFunc(nextTickHandler, 0)
    }
})()
```

以上就是异步更新的主要逻辑。可以看出**nextTick**通过闭包的方式，收集当前这个frame中所有的watcher的callback，在下一个frame中执行所有的callback，达到统一最少DOM更新次数的目的

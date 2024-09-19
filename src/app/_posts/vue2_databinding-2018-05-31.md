# Vue 2 中的数据双向绑定

此文章中列出的所有代码是基于**vue dev** branch上code，下面的代码的commit为：

```js
commit a879ec06ef9504db8df2a19aac0d07609fe36131
Author: Evan You <yyx990803@gmail.com>
Date:   Sun Apr 10 22:47:28 2016 -0400

    init
```

移除了某些代码的调用，便于理解

## **vue/src/instance/instance.js**

```js
export default class Component {
    constructor(options) {
        this.$options = options
        this._data = options.data
        const el = this._el = document.querySelector(options.el)

        // 获取虚拟节点的render函数或者表达式，原型为snabbdom，参考链接：https://github.com/snabbdom/snabbdom
        const render = compile(getOuterHTML(el))
        this._el.innerHTML = ''

        // 将options.data通过_proxy，放在当前component上，
        // 以便于提供compnent["propertyName"]方式访问options.data["propertyName"]
        Object.keys(options.data).forEach(key => this._proxy(key))

        // 将options.methods也挂在component上
        if (options.methods) {
            Object.keys(options.methods).forEach(key => {
                this[key] = options.methods[key].bind(this)
            })
        }

        // 给options.data添加__ob__属性，存放Observer, 设置component._ob为这个Observer对象
        // 遍历所有options.data的属性，设置reactiveGetter／reactiveSetter
        this._ob = observe(options.data)

        this._watchers = []

        // 创建一个对vnode的Watcher，watcher的value为render执行后得到值替换后的vnode，也就是在这个时候收集的依赖
        // 并将这个Watcher放在this._watchers中，watcher中的回掉函数为component._update
        this._watcher = new Watcher(this, render, this._update)

        // 将vnode更新到component.el上，首次执行时完成dom的挂载，watcher触发时，更新dom
        this._update(this._watcher.value)
    }

    _update(vtree) {
        if (!this._tree) {
            patch(this._el, vtree)
        } else {
            patch(this._tree, vtree)
        }
        this._tree = vtree
    }

    // options.data的属性代理
    _proxy(key) {
        if (!isReserved(key)) {
            // need to store ref to self here
            // because these getter/setters might
            // be called by child scopes via
            // prototype inheritance.
            var self = this
            Object.defineProperty(self, key, {
                configurable: true,
                enumerable: true,
                get: function proxyGetter() {
                    return self._data[key]
                },
                set: function proxySetter(val) {
                    self._data[key] = val
                }
            })
        }
    }
}
```

## **vue/src/observer/index.js**

```js
export function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return
    }
    var ob
    if (
        hasOwn(value, '__ob__') &&
        value.__ob__ instanceof Observer
    ) {
        ob = value.__ob__
    } else if (
        shouldConvert &&
        (isArray(value) || isPlainObject(value)) &&
        Object.isExtensible(value) &&
        !value._isVue
    ) {
        ob = new Observer(value)
    }
    if (ob && vm) {
        ob.addVm(vm)
    }
    return ob
}

export function Observer(value) {
    this.value = value
    this.dep = new Dep()
    // 将这个Observer对象放在value的__ob__属性上
    def(value, '__ob__', this)
    if (isArray(value)) {
        var augment = hasProto ?
            protoAugment :
            copyAugment
        augment(value, arrayMethods, arrayKeys)
        this.observeArray(value)
    } else {
        var keys = Object.keys(value)
        for (var i = 0, l = keys.length; i < l; i++) {
            // 转换value的所有属性为reactiveGetter／reactiveSetter
            defineReactive(this.value, keys[i], value[keys[i]])
        }
    }
}

export function defineReactive(obj, key, val) {
    // 定义一个依赖收集对象，在下面为属性定义get时，收集依赖于这个属性的watcher
    var dep = new Dep()

    // cater for pre-defined getter/setters
    var getter = property && property.get
    var setter = property && property.set

    // 递归的对val的属性进行拦截转换
    var childOb = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {

            var value = getter ? getter.call(obj) : val
            if (Dep.target) {

                // 依赖收集
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
            if (newVal === value) {
                return
            }
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }

            // 对newval的所有属性进行拦截转换
            childOb = observe(newVal)

            // 通知所有的wather更新
            dep.notify()
        }
    })
}
```

## **vue/src/compiler/index.js**

```js
export function compile (html) {
    html = html.trim()
    const hit = cache[html]
    // 通过generate函数，生成render方法
    return hit || (cache[html] = generate(parse(html)))
}
```

## **vue/src/compiler/codegen.js**

```js
// 输入值为ast，输出render函数
export function generate (ast) {
    const code = genElement(ast)
    return new Function (`with (this) { return ${code}}`)
}
```

## **vue/src/compiler/html-parser.js**

```js
/**
 * Convert HTML string to AST
 *
 * @param {String} html
 * @return {Object}
 */

export function parse(html) {
    let root
    let currentParent
    let stack = []
    HTMLParser(html, {
        html5: true,
        start(tag, attrs, unary) {
            let element = {
                tag,
                attrs,
                attrsMap: makeAttrsMap(attrs),
                parent: currentParent,
                children: []
            }
            if (!root) {
                root = element
            }
            if (currentParent) {
                currentParent.children.push(element)
            }
            if (!unary) {
                currentParent = element
                stack.push(element)
            }
        },
        end() {
            stack.length -= 1
            currentParent = stack[stack.length - 1]
        },
        chars(text) {
            text = currentParent.tag === 'pre' ?
                text :
                text.trim() ? text : ' '
            currentParent.children.push(text)
        },
        comment() {
            // noop
        }
    })
    return root
}
```

从代码的命名和依赖收集过程中可以看出，vue是基于组件开发的思想。但同时在依赖收集的过程中，只会在vnode中存在对options.data的属性有依赖时，属性闭包中的dep.subs中才会有watcher，做到了按需依赖，按需更新
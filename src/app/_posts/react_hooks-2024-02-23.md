# React Hooks

- React 目前偏向于纯函数编程思想，每个组件维护自己的状态，如果要共享状态，一般通过状态上移来实现，换句话说就是把需要共享的状态放在使用状态组件的父组件中。因为组件更新的时候每次都是重新调用函数生成新的组件实例。
- **Hook 只能在组件最外层调用，也就是组件初始化过程中调用，不能在 callback 或者 loops / condition 内部调用。You can only call Hooks at the top level of your component or your own Hooks. You can’t call it inside loops or conditions. If you need that, extract a new component and move the state into it.**
- useRef 的作用是存储rendering时不需要的数据，比如可以保存一个interval 的id，每次组件更新时可以获取到current的值（myRef.current）。ref.current 可以随时改，但是有个原则是不在rendering的过程中更改current的值，可以在 useEffect 或者 callback （onClick callback） 中更改。
- useState 的作用是给组件添加state 变量，通过setState 来触发组件的更新。为了避免bug，最好在更新state 的时候，通过function的方式，比如，setCount(count ⇒ count + 1)，不要用setCount(count + 1)。

    > 注意点：
    >
    > - 因为 useState 是一个 Hook，只能在组件的最上面初始化的时候调用useState，不能在 loops 或者 condition 内部调用，如果确实需要调用，可以拆分 loops / condition 为新的子组件，然后在其内部最上面调用。
- useEffect 官方的定义是：useEffect is a React Hook that lets you synchronize a component with an external system. useEffect 会在组件被添加到DOM上后，执行setup（useEffect 的第一个参数） 操作，当组件更新后，useEffect 会先用oldValue 执行 cleanup with old value （useEffect 第一个参数的返回值） 操作，然后再执行 setup with new value 操作。当组件从DOM中移除后，会执行一次cleanup 操作。所以最容易想到的就是给DOM 节点添加原生事件监听时需要用useEffect，比如，dom.addEventListener. 还有就是动画执行、手动更新dom节点、与服务器建立连接等。因为组件更新时会重新生成组件实例，之前的实例会销毁，需要重新绑定事件、建立服务器连接、动画执行、更新dom节点等。

    **An Effect lets you [keep your component synchronized](https://react.dev/learn/synchronizing-with-effects) with some external system (like a chat service). Here, *external system* means any piece of code that’s not controlled by React, such as:**

    - **A timer managed with [setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) and [clearInterval()](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval).**
    - **An event subscription using [window.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) and [window.removeEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener).**
    - **A third-party animation library with an API like animation.start() and animation.reset().**

    **If you’re not connecting to any external system, [you probably don’t need an Effect.](https://react.dev/learn/you-might-not-need-an-effect)**

    - useEffect 如果dependency 数组为空数组，代表：If you pass empty dependency array, it will only run **after the initial render.**
    - useEffect 如果dependency 为undefined / null, 也就是没有设置第二个参数，代表：If you pass no dependency array at all, your Effect runs **after every single render (and re-render)** of your component.
- useLayoutEffect 在组件被添加到DOM之前执行 setup，组件更新时，如果 useLayoutEffect的依赖项有更新，会先执行cleanup with old value，然后执行setup with new value. 在组件从DOM中移除之前，cleanup 会执行。

    **useLayoutEffect 可能会影响性能，尽可能使用useEffect. useLayoutEffect 的执行会block the browser from repainting the screen.**

    useLayoutEffect 最常用的一个case 就是调整dom的位置，比如tooltip 添加到屏幕上时，tooltip的内容并不固定，需要根据它的size来确定当前位置是否合适，是否需要调整到 top / bottom / left / right。

- useCallback 的作用时cache 一个function，这个function 是依赖于 props, state, and all the variables and functions declared directly inside your component body，这些依赖项作为useCallback的第二个参数，这样在re-render 的过程中就，如果依赖项没有更新，那这个function 就不用更新，如果这个function 恰好是另外一个组件的 props，那么就不会触发这个组件的re-render。**You should only rely on *useCallback* as a performance optimization.** If your code doesn’t work without it, find the underlying problem and fix it first. Then you may add **useCallback** back.
    - 理解 useMemo 和 useCallback的区别对理解这两个Hooks 很有帮助。
    - **[useMemo](https://react.dev/reference/react/useMemo) caches the *result* of calling your function.**
    - **useCallback caches *the function itself.***

    ```jsx
    // Simplified implementation (inside React)
    function useCallback(fn, dependencies) {
      return useMemo(() => fn, dependencies);
    }

    // useCallback 是 useMemo 的一个语法糖
    ```

    Caching a function with **useCallback**  is only valuable in a few cases:

    - You pass it as a prop to a component wrapped in **[memo](https://react.dev/reference/react/memo)** You want to skip re-rendering if the value hasn’t changed. Memoization lets your component re-render only if dependencies changed.
    - The function you’re passing is later used as a dependency of some Hook. For example, another function wrapped in **useCallback** depends on it, or you depend on this function from **[useEffect](https://react.dev/reference/react/useEffect)**

    **Make sure you’ve specified the dependency array as a second argument! If you forget the dependency array, useCallback will return a new function every time.**

- useMemo 的作用是cache 一个function（第一个参数） 执行后返回的结果，如果依赖项（第二个参数）没有更新，那在re-render的过程中，会直接返回上次计算的结果。和 useCallback一样，它唯一的作用就是性能优化。它并不能提高组件第一次render的速度，只能减少一些高消耗的不必要操作。
- useInsertionEffect 的作用是动态添加 css，比如，项目中用到了css-to-js 的第三方包，需要动态添加css。应当尽量避免这样的case，因为动态添加css 会导致浏览器频繁的计算style。
- useImperativeHandle 的作用是自定义暴露的ref，常常在forwardRef API 中使用。换句话说就是提供父组件调用子组件方法的一个途径。常见的使用场景是子组件不想暴露DOM节点给parent，这时就可以通过 useImperativeHandle 去自定义暴露内容。比如：子组件的 input focus，就是可以暴露一个 focus 方法，而不是把 DOM 节点暴露给parent，这样，parent 就可以调用 child 的方法了。

    ```jsx
    import { forwardRef, useRef, useImperativeHandle } from 'react';

    const MyInput = forwardRef(function MyInput(props, ref) {
      const inputRef = useRef(null);

      useImperativeHandle(ref, () => {
        return {
          focus() {
            inputRef.current.focus();
          },
          scrollIntoView() {
            inputRef.current.scrollIntoView();
          },
        };
      }, []);

      return <input {...props} ref={inputRef} />;
    });
    ```

- useDeferredValue 的作用是延迟更新，比如，搜索的时候，用户连续输入，这时就会不停的触发 component re-render，这时就可以通过 useDeferredValue 来做截流，当search 还在进行时，用户开始输入，React 就会 cancel 之前的search，等用户停止输入后，React 会先根据 old value 做render，之后会在后台用 updated value 再做 re-render。useDeferredValue 的第一个参数一般是 state，通过setState 更新state时就可以做到 defer state。如果 deferred value 作为一个子组件的 props，最好将子组件 用 memo 封装，这样parent re-render的时候，如果 deferred value 如果没有变化，子组件就不需要 re-render。
- useTransition 的作用是在不block UI 的情况下更新state。比如，有三个tab，其中有的tab内容加载会很慢，如果不使用useTransition，在点击tab切换到慢的tab的情况下，用户再切换到其他tab，用户会感觉很卡，点了tab没有反应。这是因为切换tab是会触发 re-render，而慢的tab 在re-render的时候很慢，导致UI block住了。通过useTransition，用户在点击tab时，并不会马上触发 re-render。React 会在它认为update 安全的情况下再re-render。如果在re-render的过程中，又通过useTransition 触发了state update，React 会中断re-render，然后会在合适的时机再re-render。**startTransition 的function 代码必须是同步的**。

- **useTransition vs useDeferredValue**

  它们的作用都是不block UI的情况下更新组件。useTransition 的使用是你可以控制setState，它封装的是方法，useDeferredValue 则是在你无法控制setState的情况下，也就是只能控制value，比如 props 只能通过useDeferredValue 来封装。它们两个都是通过降低更新优先级的方式来延迟更新操作。
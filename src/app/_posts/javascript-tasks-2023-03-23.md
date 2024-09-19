# Javascript 中的宏任务和微任务

## Tasks(宏任务)

- A new JavaScript program or subprogram is executed (such as from a console, or by running the code in a **[script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)** element directly.
- An event fires, adding the event's callback function to the task queue.
- A timeout or interval created with **[setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)** or **[setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)** is reached, causing the corresponding callback to be added to the task queue.

## Microtasks(微任务)

- JavaScript **[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** and the **[Mutation Observer API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)** both use the microtask queue to run their callbacks.

## Differences(区别)

- First, each time a task exits, the event loop checks to see if the task is returning control to other JavaScript code. If not, it runs all of the microtasks in the microtask queue. The microtask queue is, then, processed multiple times per iteration of the event loop, including after handling events and other callbacks.
- Second, if a microtask adds more microtasks to the queue by calling **[queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)**, those newly-added microtasks *execute before the next task is run*. That's because the event loop will keep calling microtasks until there are none left in the queue, even if more keep getting added.
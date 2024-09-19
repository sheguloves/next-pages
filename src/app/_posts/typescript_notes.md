# Typescript 碎碎念

- Array.forEach 在大数据量的情况下为什么性能可能有问题，是因为Array.forEach在遍历的过程中不会缓存数组的长度，导致每次都需要访问原数组来获取长度。在大数据的情况下可能会有性能问题。Lodash的 forEach对数组长度做了缓存，所以性能优于Array.forEach. Array.forEach中途无法跳出循环，只能通过try…catch的方式，在循环中通过throw error来跳出循环。

- 如何获取浏览器的刷新率。可以通过window.requestAnimationFrame 来计算得出。

- xmlRequest 如何取消。xmlRequest有原生的abort方法，可以取消请求。

- Async 和 promise的区别。Async 实际上是 promise的语法糖，要获取 Async 的error可以通过try… catch的方式。

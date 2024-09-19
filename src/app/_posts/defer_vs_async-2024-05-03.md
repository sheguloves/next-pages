# Defer VS aysnc

script 标签中，defer 和 async的区别。

![defer.jpg](/assets/defer.jpg)

![async.jpg](/assets/async.jpg)

![normal.jpg](/assets/normal.jpg)

从上面的图中可以看出:

  - 默认的script 标签会在浏览器解析HTML时下载，一旦下载完成就会立即执行，下载和执行都会打断浏览器的HTML解析。

  - Async 则是告诉浏览器，在后台下载script，但是一旦下载完成就会立即执行，同样会中断浏览器解析HTML。

  - Defer 则是告诉浏览器在后台下载，等浏览器解析完HTML后，再根据在DOM中出现的顺序执行。
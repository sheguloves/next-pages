# Canvas 基础

- Canvas API 提供了通过 **javascript** 和 **html canvas** 元素的方式绘制图形的方法。它可以用来实现动画、游戏图形、数据可视化、图像处理、实时录像处理等。
- Canvas API 大部分聚焦在 2D 图形方面。 **WebGL API** 也使用 **Canvas** 元素来绘制硬件加速的 2D 和 3D 图形。
- Canvas 可以使用 **image** 。将 image 导入 Canvas 需要两个步骤：
    1. 获取一个 image element 的 reference。
    2. 将 image 通过 canvas.drawImage() 方法画在 canvas 中。
- 导入的 image 有三种情况：
    1. 同一个 domain 下的 image，正常使用。
    2. cross-domain 的 image，需要考虑 CROS 的情况。如果源 domain 不允许跨域，则获取到的 image 将污染 canvas。被污染的 canvas 将不允许从它上面获取 image 的数据。也就是说被污染的 canvas 使用下面的方法访问数据时，会导致错误。**getImageData()**, **toBlob()**, **toDataURL()**, **captureStream()** 。

        >
        >
        >
        > Calling any of the following on a tainted canvas will result in an error:
        >
        > - Calling **[getImageData()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData)** on the canvas's context
        > - Calling **[toBlob()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)**, **[toDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)** or **[captureStream()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream)** on the **<[canvas>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)** element itself
        >
        > Attempting any of these when the canvas is tainted will cause a **SecurityError** to be thrown. This protects users from having private data exposed by using images to pull information from remote websites without permission.
        >
    3. 使用另外一个 canvas 的内容作为图像
- 如果需要查询 text 在 canvas 中的宽度，可以通过 canvasContext.measureText(text) 方法。
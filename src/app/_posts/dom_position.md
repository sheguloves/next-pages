# DOM元素的位置信息和事件位置信息

## DOM Event 的位置属性

在工作中，前端开发人员经常需要跟DOM事件打交道，而在事件对象中，有许多跟事件位置相关的属性，比如**clientX**, **clientY**, **offsetX**, **offsetY**等等，需要我们对这些属性有一个清晰的认识，在使用的时候就可以得心应手。

![mouse-event-position.png](/assets/mouse-event-position.png)

### screenX and screenY property

The **screenX** and **screenY** properties return the mouse cursors position relative to the devices screen.

### clientX and clientY

The **clientX** and **clientY** properties return the mouse cursors position relative to the application's viewport, this does not include any scrolling overflow.

**x** and **y** properties are alias for the **clientX** and **clientY** property.

### pageX and pageY

The **pageX** and **pageY** properties return the mouse cursors position relative to the current html **document**. This includes the distance the page has been scrolled horizontally or vertically.

### offsetX and offsetY

The **offsetX** and **offsetY** properties return the mouse cursors position relative to the target element the event was added to.

### movementX and movementY

The **movementX** and **movementY** properties return the relative position of the mouse cursor between the current and previous **mousemove** events firing.

## DOM元素的位置信息

![dom-position.png](/assets/dom-position.png)
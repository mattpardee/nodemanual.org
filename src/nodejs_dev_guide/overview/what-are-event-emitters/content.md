## Understanding Event Emitters

In Node.js, an event can be described simply as a string with a corresponding callback. An event can be "emitted" (or in other words, have the corresponding callback be called) multiple times; or, you can choose to only listen for the first time it is emitted. 

Here's a very simple example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=understanding.event.emitters1.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>


This demonstates all the basic functionality of an event emitter. The `on()` or `addListener()` method (they're synonymous) allows you to choose the event to watch for and the callback to be called. The `emit()` method lets you to "emit" an event, which causes all callbacks registered to the event to be called.

In the example, we first subscribe to both the `test` and `print` events. Then, we emit the `test`, `print`, and `unhandled` events. Since `unhandled` has no callback, it just returns `false`; the other two run all the attached callbacks and return `true`.

In the `print` event, note that we pass an extra parameter. Any additional parameters passed to `emit()` get passed to the callback function as arguments.

If you use the method `once()` instead of `on()`, after the callback is fired, it is removed from the list of callbacks. This is convinient if you want to detect only the first time an event has been emitted.

If you want to remove a specific callback, you can use `removeListener()`. If you want to remove all callbacks to a specific event, you can use `removeAllListeners()`. For example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=understanding.event.emitters2.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

<Note>If you want create more than 10 listeners on a single event, you will have to make a call to `setMaxListeners(n)`, where `n` is the max numbers of listeners (passing 0 allows for an unlimited number of listeners). The maximum limit is used to make sure you aren't accidently leaking event listeners.</Note>

For more information, you can refer to [the reference page on the `EventEmitter` object](../nodejs_ref_guide/EventEmitter.html).
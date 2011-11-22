## Understanding Event Emitters

In Node.js, an event can be described simply as a string with a corresponding callback. An event can be "emitted" (or in other words, have the corresponding callback be called) multiple times; or, you can choose to only listen for the first time it is emitted. 

Here's a very simple example:

    var http = require('http');
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Check the console for your results!\n');
      
        var emitter = new (require('events').EventEmitter);

        // establish two events, one for "test" and one for "print"
        emitter.addListener("test", function () { console.log("test"); });
        emitter.on("print", function (message) { console.log(message); });

        var someString = "variable";

        // try to launch the events
        emitter.emit("test");
        emitter.emit("print", "Here's a message, with " + someString);
        emitter.emit("unhandled");
    }).listen("1337", "127.0.0.1");

This demonstates all the basic functionality of an event emitter. The `on()` or `addListener()` method (they're synonymous) allows you to choose the event to watch for and the callback to be called. The `emit()` method lets you to "emit" an event, which causes all callbacks registered to the event to be called.

In the example, we first subscribe to both the `test` and `print` events. Then, we emit the `test`, `print`, and `unhandled` events. Since `unhandled` has no callback, it just returns `false`; the other two run all the attached callbacks and return `true`.

In the `print` event, note that we pass an extra parameter. Any additional parameters passed to `emit()` get passed to the callback function as arguments.

If you use the method `once()` instead of `on()`, after the callback is fired, it is removed from the list of callbacks. This is convinient if you want to detect only the first time an event has been emitted.

If you want to remove a specific callback, you can use `removeListener()`. If you want to remove all callbacks to a specific event, you can use `removeAllListeners()`. For example:

    var http = require('http');
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Check the console for your results!\n');

        var EventEmitter = require('events').EventEmitter;
        var ee = new EventEmitter();

        var callback_once = function() {
          console.log("Callback has been called!");
        }

        var callback_many = function() {
          console.log("Let's keep calling me!");
        }
        
        ee.once("event", callback_once);
        ee.emit("event");
        ee.emit("event");

        console.log ("Moving on...");
        
        ee.on("event", callback_many);
        ee.emit("event");
        ee.emit("event");
        
        console.log("Let's remove the multiple calls.");
        
        ee.removeListener("event", callback_many);
        ee.emit("event");
        
        // In theory, callback_once should still emit--but since
        // we defined it as emitting once(), we get nothing here

    }).listen("1337", "127.0.0.1");

**Note**: if you want create more than 10 listeners on a single event, you will have to make a call to `setMaxListeners(n)`, where `n` is the max numbers of listeners (passing 0 allows for an unlimited number of listeners). The maximum limit is used to make sure you aren't accidently leaking event listeners.

For more information, you can refer to [the official Node.js reference page on the `EventEmitter` object](http://nodejs.org/docs/latest/api/events.html).
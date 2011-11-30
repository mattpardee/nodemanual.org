## Events

Many objects in Node.js emit events; for example:

* `net.Server` emits an event each time a peer connects to it
* `fs.readStream` emits an event when the file is opened. 

All objects that emit events are instances of `events.EventEmitter`.

Typically, event names are represented by a camel-cased string. However, there aren't any strict restrictions on that, as any string is accepted.

These functions can then be attached to objects, to be executed when an event is emitted. Such functions are called _listeners_.

#### Accessing Event Emitters

To access the `EventEmitter` class, call `require('events').EventEmitter`.

When an `EventEmitter` instance experiences an error, the typical action is to emit an `'error'` event. Error events are treated as a special case in Node.js. If there is no listener for it, then the default action is to print a stack trace and exit the program.

All EventEmitters automatically emit the event `'newListener'` when new listeners are added.

### Events

@event `newListener`
@cb `function (event, listener)`, The callback to execute once the event fires, `event`: The event to emit, `listener`: The attaching listener

This event is emitted any time someone adds a new listener, but *before* the listener is attached.

### Methods

@method `emitter.addListener(event, callback())` / `emitter.on(event, callback())`
@param `event`: The event to listen for, `callback()`: The listener callback to execute

Adds a listener to the end of the listeners array for the specified event.

#### Example

    server.on('connection', function (stream) {
      console.log('someone connected!');
    });

@method `emitter.emit(event, [arg...])`
@param `event`: The event to listen for, `[arg...]`: Any optional arguments for the listeners

Execute each of the subscribed listeners in order with the supplied arguments.

@method `emitter.listeners(event)`
@param `event`: The event type to listen for

Returns an array of listeners for the specified event. This array can be
manipulated, e.g. to remove listeners.

#### Example

    server.on('connection', function (stream) {
      console.log('someone connected!');
    });
    console.log(util.inspect(server.listeners('connection'))); // [ [Function] ]
    
@method `emitter.once(event, listener)`
@param `event`: The event to listen for, `callback()`: The listener callback to execute

Adds a **one time** listener for the event. This listener is invoked only the next time the event is fired, after which it is removed.

#### Example

    server.once('connection', function (stream) {
      console.log('Ah, we have our first user!');
    });

@method `emitter.removeAllListeners([event])`
@param `event`: An optional event type to remove

Removes all listeners, or those of the specified event.

@method `emitter.removeListener(event, listener)`
@param `event`: The event to listen for, `callback()`: The listener callback to execute

Remove a listener from the listener array for the specified event.

**Caution**: this can change array indices in the listener array behind the listener.

#### Example

    var callback = function(stream) {
      console.log('someone connected!');
    };
    server.on('connection', callback);
    // ...
    server.removeListener('connection', callback);


@method `emitter.setMaxListeners(n)`
@param `n`: An integer indicated the max

By default, EventEmitters print a warning if more than 10 listeners are added for a particular event. This is a useful default which helps finding memory leaks.

Obviously, not all Emitters should be limited to 10. This function allows
that to be increased. Set it to `0` for unlimited listeners.

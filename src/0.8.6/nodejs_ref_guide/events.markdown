## eventemitter

> Stability: 4 - API Frozen

Many objects in Node.js emit events. Some examples include:

* [[net.Server `net.Server`]], which emits an event each time a peer connects to
it
* [[fs.ReadStream `fs.ReadStream`]], which emits an event when the file is
opened. 

All objects that emit events are instances of `events.EventEmitter`.

Typically, event names are represented by a camel-cased string. However, there
aren't any strict restrictions on that, as any string is accepted.

These functions can then be attached to objects, to be executed when an event is
emitted. Such functions are called _listeners_.

To inherit from `EventEmitter`, add `require('events').EventEmitter` to your
code.

When an `EventEmitter` instance experiences an error, the typical action is to
emit an `'error'` event. Error events are treated as a special case in Node.js.
If there is no listener for it, then the default action is to print a stack
trace and exit the program.

All EventEmitters automatically emit the event `'newListener'` when new
listeners are added.

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/event_emitter/eventemitter.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

### eventemitter@newListener(event, listener())
- event {String}  The event to emit
- listener {Function}  The attaching listener

This event is emitted any time someone adds a new listener, but *before* the
listener is attached.

### eventemitter.addListener(event, callback())
- event {String}   The event to listen for
- callback {Function}   The listener callback to execute
(alias of: eventemitter.on)

Adds a listener to the end of the listeners array for the specified event.

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/event_emitter/eventemitter.addlistener.js?linestart=0&lineend=0&showlines=fals e' defer='defer'></script>

### eventemitter.on(event, callback())
- event {String}   The event to listen for
- callback {Function}   The listener callback to execute
(alias of: eventemitter.addListener)

Adds a listener to the end of the listeners array for the specified event.

### eventemitter.emit(event [, arg...])
- event {String}  The event to listen for
- arg {Object}   Any optional arguments for the listeners

Execute each of the subscribed listeners in order with the supplied arguments.

### eventemitter.listeners(event)
- event {String}  The event type to listen for

Returns an array of listeners for the specified event.

This array **may** be a mutable reference to the same underlying list of
listeners that is used by the event subsystem.  However, certain
actions (specifically, [[eventemitter.removeAllListeners `removeAllListeners()`]]) invalidates this
reference.

If you would like to get a copy of the listeners at a specific point in
time that is guaranteed not to change, make a copy by doing something like
`emitter.listeners(event).slice(0)`.

In a future release of node, this behavior **may** change to always
return a copy, for consistency.  In your programs, please do not rely on
being able to modify the EventEmitter listeners using array methods.
Always use the [[eventemitter.on `on()`]] method to add new listeners.


#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/event_emitter/eventemitter.listeners.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>    

### eventemitter.once(event, listener())
- event {String}   The event to listen for
- listener {Function}   The listener callback to execute

Adds a **one time** listener for the event. This listener is invoked only the
next time the event is fired, after which it is removed.

#### Example

    server.once('connection', function (stream) {
      console.log('Ah, we have our first user!');
    });

### eventemitter.removeAllListeners([event])
- event {String}  An optional event type to remove

Removes all listeners, or those of the specified event.

Note: This **invalidates** any arrays that have previously been
returned by [[eventemitter.listeners `eventemitter.listeners`]].

### eventemitter.removeListener(event, listener())
- event {String}   The event to listen for
- listener {Function}   The listener callback to execute

Remove a listener from the listener array for the specified event.

Warning: This can change array indices in the listener array behind the
listener.

#### Example

    var callback = function(stream) {
      console.log('someone connected!');
    };
    server.on('connection', callback);
    // ...
    server.removeListener('connection', callback);

### eventemitter.setMaxListeners(n)
- n {Number}  The maximum number of listeners

By default, EventEmitters print a warning if more than 10 listeners are added
for a particular event. This is a useful default which helps finding memory
leaks.

Obviously, not all Emitters should be limited to 10. This function allows that
to be increased. Set it to `0` for unlimited listeners.

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/event_emitter/eventemitter.setMaxListeners.js?linestart=0&lineend=0&showlines= false' defer='defer'></script>
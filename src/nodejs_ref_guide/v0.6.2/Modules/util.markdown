## util

These functions are in the module `'util'`. To access them, use `require('util')`.

### Methods

@method `util.debug(str)`
@param `str`: The string to print

A synchronous output function. This block the process and outputs `string` immediately to `stderr`.

@method `util.format([arg...])`
@param `[arg]`: The string to print, and any additional formatting arguments

Returns a formatted string using the first argument in a `printf()`-like format.

The first argument is a string that contains zero or more placeholders. Each placeholder is replaced with the converted value from its corresponding argument. Supported placeholders are:

* `%s` - String.
* `%d` - Number (both integer and float).
* `%j` - JSON.
* `%%` - single percent sign (`'%'`). This does not consume an argument.

If the placeholder does not have a corresponding argument, the placeholder is not replaced, as in this example:

    util.format('%s:%s', 'foo'); // 'foo:%s'

If there are more arguments than placeholders, the extra arguments are converted to strings with `util.inspect()` and these strings are concatenated, delimited by a space:

    util.format('%s:%s', 'foo', 'bar', 'baz'); // 'foo:bar baz'

If the first argument is not a format string, then `util.format()` returns a string that is the concatenation of all its arguments separated by spaces. Each argument is converted to a string with `util.inspect()`.

    util.format(1, 2, 3); // '1 2 3'

@method `util.inspect(object, showHidden=false, depth=2)`
@param `object`: The object to be represented, `showHidden`: Identifies whether the non-enumerable properties are also shown; the default is `false`, `depth`: Indicates how many times to recurse while formatting the object; the default is `2`

Returns a string representation of `object`, which is useful for debugging.

To make the function recurse an object indefinitely, pass in `null` for `depth`.

#### Example

Here's an example inspecting all the properties of the `util` object:

    var util = require('util');
    console.log(util.inspect(util, true, null));

@method `util.isArray(object)`
@param `object`: The object to be identified

Returns `true` if the given object is an `Array`.

#### Example

    var util = require('util');

    util.isArray([])
      // true
    util.isArray(new Array)
      // true
    util.isArray({})
      // false

@method `util.isDate(object)`
@param `object`: The object to be identified

Returns `true` if the given object is a `Date`.

#### Example

    var util = require('util');

    util.isDate(new Date())
      // true
    util.isDate(Date())
      // false (without 'new' returns a String)
    util.isDate({})
      // false


@method `util.isError(object)`
@param `object`: The object to be identified

Returns `true` if the given object is an `Error`.

#### Example

    var util = require('util');

    util.isError(new Error())
      // true
    util.isError(new TypeError())
      // true
    util.isError({ name: 'Error', message: 'an error occurred' })
      // false
 
@method `util.isRegExp(object)`
@param `object`: The object to be identified

Returns `true` if the given "object" is a `RegExp`.

#### Example

    var util = require('util');

    util.isRegExp(/some regexp/)
      // true
    util.isRegExp(new RegExp('another regexp'))
      // true
    util.isRegExp({})
      // false
      
 
@method `util.log(str)`
@param `str`: The string to print

Outputs to `stdout`...but with a timestamp!


@method `util.pump(readableStream, writableStream, [callback()])`
@param `readableStream`: The stream to read from, `writableStream`: The stream to write to, `callback()`: An optional callback function once the pump is through

Reads the data from `readableStream` and sends it to the `writableStream`.

When `writableStream.write(data)` returns `false`, `readableStream` is
paused until the `drain` event occurs on the `writableStream`. `callback` gets
an error as its only argument and is called when `writableStream` is closed or
when an error occurs.

@method `util.inherits(constructor, superConstructor)`
@param `constructor`: The prototpye methods to inherit, `superConstructor`: The new object's type

Inherit the prototype methods from one [constructor](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/constructor)
into another.  The prototype of `constructor` is set to a new
object created from `superConstructor`.

As an additional convenience, `superConstructor` is accessible through the `constructor.super_` property.

#### Example

    var util = require("util");
    var events = require("events");

    function MyStream() {
        events.EventEmitter.call(this);
    }

    util.inherits(MyStream, events.EventEmitter);

    MyStream.prototype.write = function(data) {
        this.emit("data", data);
    }

    var stream = new MyStream();

    console.log(stream instanceof events.EventEmitter); // true
    console.log(MyStream.super_ === events.EventEmitter); // true

    stream.on("data", function(data) {
        console.log('Received data: "' + data + '"');
    })
    stream.write("It works!"); // Received data: "It works!"

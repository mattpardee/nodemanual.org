/**
 * class util
 *
 * 
 * The `util` module provides varies utilities that you can use in your Node.js programs, fmostly around verifying the type of an object. To access these methods, add `require('util')` to your code.
 *
 * A major difference between these methods and the ones found in the [[console `console`]] module is that these don't print to the console.
 * 
 **/

/**
 * util.debug(str) -> String
 * - str (String):  The string to print
 * 
 * A synchronous output function. This block the process and outputs `string` immediately to `stderr`.
 * 
 *
**/ 


/**
 * util.format([arg...]) -> String
 * - arg (String):  The string to print, and any additional formatting arguments
 * 
 * Returns a formatted string using the first argument in [a `printf()`-like](http://en.wikipedia.org/wiki/Printf_format_string#Format_placeholders) way.
 * 
 * The first argument is a string that contains zero or more placeholders. Each placeholder is replaced with the converted value from its corresponding argument. Supported placeholders are:
 * 
 * * `%s` - String.
 * * `%d` - Number (both integer and float).
 * * `%j` - JSON.
 * * `%%` - single percent sign (`'%'`). This does not consume an argument.
 * 
 *
 * #### Example
 *
 * If the placeholder does not have a corresponding argument, the placeholder is not replaced, as in this example:
 * 
 *	   var util = require("util");
 *     util.format('%s:%s', 'foo'); // 'foo:%s'
 * 
 * If there are more arguments than placeholders, the extra arguments are converted to strings with `util.inspect()` and these strings are concatenated, delimited by a space:
 * 
 *	   var util = require("util");
 *     util.format('%s:%s', 'foo', 'bar', 'baz'); // 'foo:bar baz'
 * 
 * If the first argument is not a format string, then [[util.format `util.format()`]] returns a string that is the concatenation of all its arguments separated by spaces. Each argument is converted to a string with [[util.inspect `util.inspect()`]].
 * 
 *	   var util = require("util");
 *     util.format(1, 2, 3); // '1 2 3'
 * 
**/ 


/**
 * util.inspect(object, showHidden=false, depth=2) -> String
 * - object (Object):  The object to be represented
 * - showHidden (Boolean): Identifies whether the non-enumerable properties are also shown
 * - depth (Number): Indicates how many times to recurse while formatting the object
 *
 * Returns a string representation of `object`, which is useful for debugging.
 * 
 * To make the function recurse an object indefinitely, pass in `null` for `depth`.
 * 
 * #### Example
 * 
 * Here's an example inspecting all the properties of the `util` object:
 * 
 *     var util = require('util');
 *     console.log(util.inspect(util, true, null));
 * 
**/ 


/**
 * util.isArray(object) -> Boolean
 * - object (Object):  The object to be identified
 * 
 * Returns `true` if the given object is an `Array`.
 * 
 * #### Example
 * 
 *     var util = require('util');
 * 
 *     util.isArray([])
 *       // true
 *     util.isArray(new Array)
 *       // true
 *     util.isArray({})
 *       // false
 * 
**/ 


/**
 * util.isDate(object) -> Boolean
 * - object (Object):  The object to be identified
 * 
 * Returns `true` if the given object is a `Date`.
 * 
 * #### Example
 * 
 *     var util = require('util');
 * 
 *     util.isDate(new Date())
 *       // true
 *     util.isDate(Date())
 *       // false (without 'new' returns a String)
 *     util.isDate({})
 *       // false
 * 
 * 
**/ 


/**
 * util.isError(object) -> Boolean
 * - object (Object):  The object to be identified
 * 
 * Returns `true` if the given object is an `Error`.
 * 
 * #### Example
 * 
 *     var util = require('util');
 * 
 *     util.isError(new Error())
 *       // true
 *     util.isError(new TypeError())
 *       // true
 *     util.isError({ name: 'Error', message: 'an error occurred' })
 *       // false
 * 
**/ 


/**
 * util.isRegExp(object) -> Boolean
 * - object (Object):  The object to be identified
 *
 * Returns `true` if the given "object" is a `RegExp`.
 * 
 * #### Example
 * 
 *     var util = require('util');
 * 
 *     util.isRegExp(/some regexp/)
 *       // true
 *     util.isRegExp(new RegExp('another regexp'))
 *       // true
 *     util.isRegExp({})
 *       // false
 *       
 * 
**/ 


/**
 * util.log(str) -> Void
 * - str (String): The string to print
 * 
 * Outputs to `stdout`...but with a timestamp!
 *
**/ 


/**
 * util.pump(readableStream, writableStream, [callback()]) -> Void
 * - readableStream (stream.ReadableStream): The stream to read from
 * - writableStream (stream.WritableStream): The stream to write to
 * - callback (Function):  An optional callback function once the pump is through
 * 
 * Reads the data from `readableStream` and sends it to the `writableStream`.
 * 
 * When `writableStream.write(data)` returns `false`, `readableStream` is paused until the `drain` event occurs on the `writableStream`. `callback` gets an error as its only argument and is called when `writableStream` is closed or when an error occurs.
 *
**/ 


/** 
 * util.inherits(constructor, superConstructor) -> Void
 * - constructor (Function): The prototype methods to inherit
 * - superConstructor (Object): The new object's type
 *
 * Inherit the prototype methods from one constructor into another. The prototype of `constructor` is set to a new object created from `superConstructor`.
 * 
 * As an additional convenience, `superConstructor` is accessible through the `constructor.super_` property.
 *
 * For more information, see the MDN [`constructor`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/constructor) documentation.
 * 
 * #### Example
 * 
 *     var util = require("util");
 *     var events = require("events");
 * 
 *     function MyStream() {
 *         events.EventEmitter.call(this);
 *     }
 * 
 *     util.inherits(MyStream, events.EventEmitter);
 * 
 *     MyStream.prototype.write(data) {
 *         this.emit("data", data);
 *     }
 * 
 *     var stream = new MyStream();
 * 
 *     console.log(stream instanceof events.EventEmitter); // true
 *     console.log(MyStream.super_ === events.EventEmitter); // true
 * 
 *     stream.on("data", function(data) {
 *         console.log('Received data: "' + data + '"');
 *     })
 *     stream.write("It works!"); // Received data: "It works!"
 * 
**/ 


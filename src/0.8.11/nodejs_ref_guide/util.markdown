## util

> Stability: 5 - Locked


The `util` module provides varies utilities that you can use in your Node.js
programs, fmostly around verifying the type of an object. To access these
methods, add `require('util')` to your code.


### util.debug(str), String
- str {String}   The string to print

A synchronous output function. This block the process and outputs `string`
immediately to `stderr`.



### util.format(format...), String
- format {String} A message, and placeholders used for formatting

Returns a formatted string using the first argument in 
a [`printf()`-like](http://en.wikipedia.org/wiki/Printf_format_string#Format_placeholders) way.

The first argument is a string that contains zero or more placeholders. Each
placeholder is replaced with the converted value from its corresponding
argument. Supported placeholders are:

* `%s` - String.
* `%d` - Number (both integer and float).
* `%j` - JSON.
* `%%` - single percent sign (`'%'`). This does not consume an argument.


#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/util/util.format.js?linestart=3&lineend=0&showlines=false' defer='defer'></script> 


### util.inspect(object, showHidden=false, depth=2), String
- object {Object}   The object to be represented
- showHidden {Boolean}  Identifies whether the non-enumerable properties are
also shown
- depth {Number}  Indicates how many times to recurse while formatting the
object

Returns a string representation of `object`, which is useful for debugging.

To make the function recurse an object indefinitely, pass in `null` for `depth`.

If `colors` is `true`, the output is styled with ANSI color codes.

#### Example

Here's an example inspecting all the properties of the `util` object:

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/util/util.inspect.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>


### util.error([str...]), String
- str {String}   The string to print

Same as `util.debug()` except this will output all arguments immediately to
`stderr`.

### util.puts([str...]), String
- str {String}   The string to print

A synchronous output function. Will block the process and output all arguments
to `stdout` with newlines after each argument.

### util.print([str...])
- str {String}   The string to print

A synchronous output function. Will block the process, cast each argument to a
string then output to `stdout`. Does not place newlines after each argument.

### util.isArray(object), Boolean
- object {Object}   The object to be identified

Returns `true` if the given object is an `Array`.

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/util/util.isArray.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>



### util.isDate(object), Boolean
- object {Object}   The object to be identified

Returns `true` if the given object is a `Date`.

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/util/util.isDate.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>



### util.isError(object), Boolean
- object {Object}   The object to be identified

Returns `true` if the given object is an `Error`.

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/util/util.isError.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>



### util.isRegExp(object), Boolean
- object {Object}   The object to be identified

Returns `true` if the given "object" is a `RegExp`.

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/util/util.isRegExp.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>




### util.log(str)
- str {String}  The string to print

Outputs to `stdout`...but with a timestamp!




### util.pump(readableStream, writableStream, [callback()])
- readableStream {stream.ReadableStream}  The stream to read from
- writableStream {stream.WritableStream}  The stream to write to
- callback {Function}   An optional callback function once the pump is through
(deprecated)

This function is deprecated. Use [[stream.ReadableStream.pipe `stream.ReadableStream.pipe()`]] instead.

Reads the data from `readableStream` and sends it to the `writableStream`.

When `writableStream.write(data)` returns `false`, `readableStream` is paused
until the `drain` event occurs on the `writableStream`. `callback` gets an error
as its only argument and is called when `writableStream` is closed or when an
error occurs.


### util.inherits(constructor, superConstructor)
- constructor {Function}  The prototype methods to inherit
- superConstructor {Object}  The new object's type

Inherit the prototype methods from one constructor into another. The prototype
of `constructor` is set to a new object created from `superConstructor`.

As an additional convenience, `superConstructor` is accessible through the
`constructor.super_` property.

For more information, see the MDN
[`constructor`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/constructor) documentation.

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/util/util.inherits.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>




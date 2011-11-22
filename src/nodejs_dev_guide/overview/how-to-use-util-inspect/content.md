### Debugging with Util.Inspect()

Node.js provides a utility function, for debugging purposes, that returns a string representation of an object.  It's called `util.inspect()`, and it can be very useful when working with properties of large, complex objects. 

`util.inspect()` can be used on any object. As a demonstration, we'll use one of Node's built-in objects. Type `node` in your command prompt, and then enter the following line:

     var util = require('util')
     util.inspect(console)
     
The output should be:

     { log: [Function], info: [Function], warn: [Function], 
       error: [Function], dir: [Function], time: [Function], 
       timeEnd: [Function], trace: [Function], 
       assert: [Function] }
     
This is a listing of all the enumerable properties of the `console` object.  It is also worth noting that `console.dir()` is a wrapper around `util.inspect()`, and uses its default arguments.

In the command prompt, `util.inspect()` immediately returns its output&mdash;this is not usually the case.  In the context of normal Node.js code in a file, something must be done with the output. The simplest thing to do is wrap it within a `console.log()` call:

     console.log(util.inspect(myObj));

`util.inspect()` can also be passed several optional arguments, shown here with their defaults:

     util.inspect(object, showHidden=false, depth=2, colorize=true);

For example, `util.inspect(myObj, true, 7, true)` inspects `myObj`, showing all the hidden and non-hidden properties up to a depth of `7` and colorize the output. Let's go over the arguments individually.

The argument `showHidden` is a boolean that determines whether or not the "non-enumerable" properties of an object are displayed&mdash;it defaults to `false`, which tends to result in vastly more readable output. This isn't something a beginner needs to worry about most of the time, but it's worth demonstrating briefly. Try the following in the command prompt:

     var util = require('util');
     util.inspect(console, true);

The `depth` argument is the number of levels deep into a nested object to recurse&mdash;it defaults to 2.  Setting it to `null` causes it to recurse "all the way," showing every level.  Compare the (size of) the outputs of these two `util.inspect` statements in the command prompt:

     var http = require('http');
     util.inspect(http, true, 1);
     util.inspect(http, true, 3);

Finally, the optional argument `colorize` is a boolean that adds ANSI escape codes to the string output. When logged to a terminal window, it should be pretty printed with colors.

     var util = require('util');
     console.log(util.inspect({a:1, b:"b"}, false,2,true));
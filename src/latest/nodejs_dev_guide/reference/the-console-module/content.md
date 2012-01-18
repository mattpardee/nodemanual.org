## The Console Module

Anyone familiar with browser-side development has probably used `console.log` for debugging purposes. Node.js has implemented a built-in `console` object to mimic much of this experience.  Since we're working server-side, however, it wraps content to `stdout`, `stdin`, and `stderr` instead of the browser's debugging console.

Because of this browser parallel, the `console` module has become home to quite a bit of Node's standard output functionality. The simplest is `console.log()`.

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=console.basics.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

This example just prints the provided string to `stdout`.  It can also be used to output the contents of variables, as evidenced in by the second line. Furthermore, `console.dir()` is called on any objects passed in as arguments, enumerating their properties.

#### Styling the Output

`console.log()` accepts three format characters: `%s`, `%d`, and `%j`. These format characters can be used to insert string, integer, or JSON data into your output. The order of format characters must match the order of arguments. For example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=styling.output.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

A caveat with `console.log`, and all functions that depend on it, is that it buffers the output. If your process ends suddenly, whether it be from an exception or from `process.exit()`, it is entirely possible that the buffered output will never reach the screen. This can cause a great deal of frustration, so watch out for this unfortunate situation.

`console.error()` works the same as `console.log`, except that the output is sent to `stderr` instead of `stdout`.  This is an extremely important difference, as `stderr` is always written synchronously.  Any use of `console.error`, or any of the other functions in Node.js core that write to `stderr`, blocks your process until the output has all been written.  This is useful for error messages&mdash;you get them exactly when they occur&mdash;but can greatly slow down your process if used everywhere.

`console.dir()` is an alias for `util.inspect()`. It is used to enumerate object properties. You can read more about it [here](how-to-use-util-inspect.html).

#### Additional Methods

That covers the basic `console` module functionality, but there are a few other methods worth mentioning as well. First, the `console` module allows for the marking of time via `console.time()` and `console.timeEnd()`.  Here is an example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=console.time.example.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

This would determine the amount of time taken to perform the actions in between the `console.time` and `console.timeEnd` calls.

One last function worth mentioning is `console.trace()`, which prints a stack trace to its location in your code without throwing an error.  This can occasionally be useful if you'd like to figure out where a particular failing function was called from.

For a complete list of properties and methods available to `console`, see [the Node.js reference documentation on STDIO](../nodejs_ref_guide/console.html).
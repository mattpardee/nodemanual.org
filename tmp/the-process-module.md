

&ltdiv class="hero-unit">

<a class="hiddenLink" id="the-process-module"></a>

## The Process Module
<span class="cite">by Charlie McConnell (Last Updated: Aug 26 2011)</span>


Each Node.js process has a set of built-in functionality, accessible through the global `process` module.  The `process` module doesn't need to be required: it is somewhat literally a wrapper around the currently executing process, and many of the methods it exposes are actually wrappers around calls into some of Node's core C libraries.

#### Events

There are two built-in events worth noting in the `process` module: `exit` and `uncaughtException`.

The `exit` event fires whenever the process is about to exit.

    process.on('exit', function () {
        fs.writeFileSync('/tmp/myfile', 'This MUST be saved on exit.', function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
        });
    });

Code like the above can occasionally be useful for saving some kind of final report before you exit.  Note the use of a synchronous file system call. This is to make sure the I/O finishes before the process actually exits.

The `uncaughtException` event fires, as you might guess, whenever an exception has occurred that hasn't been caught or dealt with somewhere else in your program. It's not the ideal way to handle errors, but it can be very useful as a last line of defense if a program needs to stay running indefinitely. For example:

     process.on('uncaughtException', function (err) {
       console.error('An uncaught error occurred!');
       console.error(err.stack);
     });

The default behavior on `uncaughtException` is to print a stack trace and exit. Using the above as an example, your program displays the message provided and the stack trace, but will **not** exit.

#### Streams

The `process` object also provides wrappings for the three standard input and output streams: `stdout`,`stderr`, and `stdin`. Briefly:

* `stdout` is a non-blocking (asynchronous) writeable stream
* `stderr` is a blocking (synchronous) writeable stream.
* `stdin` is a readable stream (where one would read input from the user)

The simplest one to describe is `process.stdout`.  Technically, most output in Node.js is accomplished by using `process.stdout.write()`.  The following is from `console.js`:

      exports.log = function() {
        process.stdout.write(format.apply(this, arguments) + '\n');
      };

Since most people are used to the `console.log()` syntax from browser development, it was provided as a convenient wrapper for `process.stdout.write()`.

Next is `process.stderr`, which is very similar to `process.stdout` with one key exception: your process blocks until the write is completed. Node.js provides a number of alias functions for output, most of which either end up using `stdout` or `stderr` under the hood.  Here's a quick reference list:

* STDOUT, or non-blocking functions: `console.log`, `console.info`, `util.puts`, `util.print`

* STDERR, or blocking functions: `console.warn`, `console.error`, `util.debug`

Lastly, `process.stdin` is a readable stream for getting user input. For more information, see [the section on prompting for input](#how-to-prompt-for-command-line-input).

For a complete list of properties and methods available to `process`, see [the official Node.js documentation](http://nodejs.org/docs/latest/api/process.html).

#### Additional Properties

The `process` module contains a variety of properties that allow you to access information about the running process.  Let's run through a few quick examples. First, type `node` in the command line. Then, type the following commands:

    > process.pid
    3290
    > process.version
    'v0.6.1'
    > process.platform
    'linux'
    > process.title
    'node'

You values may be different. Here's what these properties mean:

* `process.version` refers to your Node.js version
* `process.pid` is the operating system process ID
* `process.platform` is something general like 'linux' or 'darwin'
* `process.title` is a little bit different. While set to `node` by default, it can be set to anything you want, and defines the name displayed when viewing a list of running processes.

The `process` module also exposes `process.argv`, an array containing the command-line arguments to the current process, and `process.argc`, an integer representing the number of arguments passed in.  Here's more information on [how to parse command line arguments](#how-to-parse-command-line-arguments).

#### Additional Methods

There are also a variety of methods attached to the `process` object, many of which deal with quite advanced aspects of a program. Here's a look at a few of the more commonly useful ones.

`process.exit()` exits the process.  If you call an asynchronous function, and then call `process.exit()` immediately afterwards, you will be in a race condition&mdash;the asynchronous call may or may not complete before the process is exited.  `process.exit` accepts one optional argument, an integer exit code. `0`, by convention, is an exit with no errors.

`process.cwd` returns the current working directory of the process. This is often the directory from which the command to start the process was issued.

`process.chdir` is used to change the current working directory.  For example:

    > process.cwd()
    '/home/avian/dev'
    > process.chdir('/home/avian')
    > process.cwd()
    '/home/avian'

Finally, on a more advanced note, there's `process.nextTick()`. This method accepts one argument&mdash;a callback&mdash;and places it at the top of the next iteration of the event loop.  Some people do something like this:

    setTimeout(function () {
      // code here
    }, 0)

This, however, is not ideal.  In Node.js, this should be used instead:

    process.nextTick(function () {
        console.log('Next trip around the event loop, wheeee!');
    });

It is much more efficient, and much more accurate.&lt/div>

## repl

A Read-Eval-Print-Loop (REPL) is available both as a standalone program and
easily includable in other programs. The REPL provides a way to interactively 
run JavaScript and see the results.  It can be used for debugging, testing, or 
just trying things out.

By executing `node` without any arguments from the command line, you'll be
dropped into the REPL. It has a simplistic emacs line-editing:

    mjr:~$ node
    Type '.help' for options.
    > a = [ 1, 2, 3];
    [ 1, 2, 3 ]
    > a.forEach(function (v) {
    ...   console.log(v);
    ...   });
    1
    2
    3

For advanced line-editors, start `node` with the environmental variable
`NODE_NO_READLINE=1`. This will start the main and debugger REPL in canonical 
terminal settings which allow you to use with `rlwrap`.

For a quicker configuration, you could add this to your `.bashrc` file:

    alias node="env NODE_NO_READLINE=1 rlwrap node"

#### REPL Features

Inside the REPL, multi-line expressions can be input, and tab completion is
supported for both global and local variables.

The special variable `_` contains the result of the last expression, like so:

    > [ "a", "b", "c" ]
    [ 'a', 'b', 'c' ]
    > _.length
    3
    > _ += 1
    4

The REPL provides access to any variables in the global scope. You can expose a
variable to the REPL explicitly by assigning it to the `context` object
associated with each `REPLServer`.  For example:

    // repl_test.js
    var repl = require("repl"),
        msg = "message";

    repl.start().context.m = msg;

Things in the `context` object appear as local within the REPL:

    mjr:~$ node repl_test.js
    > m
    'message'

#### Special Commands

There are a few special REPL commands:

  - `.break`: while inputting a multi-line expression, sometimes you get lost or
just don't care about completing it; this wipes it out so you can start over
  - `.clear`: resets the `context` object to an empty object and clears any
multi-line expression.
  - `.exit`: closes the I/O stream, which causes the REPL to exit.
  - `.help`: shows this list of special commands
  - `.save`: save the current REPL session to a file, like so: `>.save
./file/to/save.js`
  - `.load`: loads a file into the current REPL session, like so: `>.load
./file/to/load.js`

#### Key Combinations

The following key combinations in the REPL have special effects:

  - `<ctrl>C` - Similar to the `.break` keyword, this terminates the current
command.  Press twice on a blank line to forcibly exit the REPL.
  - `<ctrl>D` - Similar to the `.exit` keyword, it closes to stream and exits
the REPL
        

### repl.start(options)
- options {Object} Configuration options for the REPL

Returns and starts a `REPLServer` instance.

`options` is an object with following properties: 

- `prompt`: The starting prompt and `stream` for all I/O. Defaults to `> `.

 - `input`: The readable stream to listen to. Defaults to `process.stdin`.

 - `output`: The writable stream to write readline data to. Defaults to
   `process.stdout`.

 - `terminal`: Pass `true` if the `stream` should be treated like a TTY, and
   have ANSI/VT100 escape codes written to it. Defaults to checking `isTTY`
   on the `output` stream upon instantiation.

 - `eval`: An asynchronous wrapper function that is used to eval each given 
   line. Defaults to an async wrapper for `eval()`. See below for an example of 
   a custom `eval`.

 - `useColors`: Specifies whether the `writer` function
   should output colors. If a different `writer` function is set then this does
   nothing. Defaults to the repl's `terminal` value.

 - `useGlobal`: Specifies whether the repl uses the `global` object,
   instead of running scripts in a separate context. Defaults to `false`.

 - `ignoreUndefined`: Specifies whether the repl should output the
   return value of a command if it's `undefined`. Defaults to `false`.

 - `writer`: The function to invoke for each command that gets evaluated which
   returns the formatting (including coloring) to display. Defaults to
   `util.inspect`.


 You can use your own `eval` function if it has the following signature:
 
    function eval(cmd, context, filename, callback) {
      callback(null, result);
    }
 
Multiple REPLs can be started against the same running instance of node.  Each
share the same global object but will have unique I/O.
 
#### Examples
 
 <script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/repl/repl.start.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

For an example of running a "full-featured" (`terminal`) REPL over
a `net.Server` and `net.Socket` instance, see: <https://gist.github.com/2209310>

For an example of running a REPL instance over `curl(1)`,
see: <https://gist.github.com/2053342>

### repl@exit

Emitted when the user exits the REPL in any of the defined ways. Namely, typing
`.exit` at the repl, pressing Ctrl+C twice to signal SIGINT, or pressing Ctrl+D
to signal "end" on the `input` stream.

#### Example: Listening for `exit`

    r.on('exit', function () {
      console.log('Got "exit" event from repl!');
      process.exit();
    });
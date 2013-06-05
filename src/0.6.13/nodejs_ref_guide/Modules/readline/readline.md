/**
class readline

Readline allows you to read of a stream (such as STDIN) on a line-by-line basis. To use this module, add `require('readline')` to your code.

<Note>Once you've invoked this module, your Node.js program won't terminate until you've closed the interface, and the STDIN stream. Here's how to allow your program to gracefully terminate:

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/readline/readline.escaping.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

</Note>

#### Example: Crafting a tiny command line interface:

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/readline/readline.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

For more real-life use cases, take a look at this slightly more complicated [example](https://gist.github.com/901104), as well as the [http-console](https://github.com/cloudhead/http-console) module.

**/
 
  
/**
readline.createInterface(input[, output], completer()) -> readline.interface
- input (streams.ReadableStream):  The readable stream
- output (streams.WritableStream):  The writeable stream
- completer (Function):  A function to use for autocompletion

Takes two streams and creates a readline interface. 

When passed a substring, `completer()` returns `[[substr1, substr2, ...], originalsubstring]`.

`completer()` runs in an asynchronous manner if it accepts just two arguments:

    function completer(linePartial, callback) {
        callback(null, [['123'], linePartial]);
    }

#### Example

`createInterface()` is commonly used with `process.stdin` and `process.stdout` in order to accept user input:

    var readline = require('readline');

    var myTerminal = readline.createInterface(process.stdin, process.stdout);
  

**/ 

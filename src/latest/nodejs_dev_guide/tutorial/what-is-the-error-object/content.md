# The Global `Error` Object

The error object is a built-in object that provides a standard set of useful information when an error occurs, such as a stack trace and the error message. For example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=error.object.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

The result of this code is:

     { stack: [Getter/Setter],
       arguments: undefined,
       type: undefined,
       message: 'The error message' }
     Error: The error message
         at Object.<anonymous> (/home/nico/example.js:1:75)
         at Module._compile (module.js:407:26)
         at Object..js (module.js:413:10)
         at Module.load (module.js:339:31)
         at Function._load (module.js:298:12)
         at Array.0 (module.js:426:10)
         at EventEmitter._tickCallback (node.js:126:26)

`error.stack` shows you where an error came from, as well as a list of the function calls that preceded it. For your convenience, `error.stack` always prints `error.message` as the first line of its output, making `error.stack` a convenient single property to log during debugging.

If you want to add more information to the Error object, you can always add properities, just as with any other Javascript object: 

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=error.object.1.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

For more details how to use the Error object, check out the [article on error conventions](what-are-the-error-conventions.html).
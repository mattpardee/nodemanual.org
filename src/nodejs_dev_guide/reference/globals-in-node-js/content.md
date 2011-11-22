## A (Brief) List of Globals in Node.js

Node.js has a number of built-in global identifiers that every Node.js developer should have some familiarity with. Some of these are true globals, being visible everywhere; others exist at the module level, but are inherent to every module, thus being pseudo-globals.

First, let's go through the list of 'true globals':

* `global`: The global namespace. Setting a property to this namespace makes it globally visible within the running process.

* `process`: Node's built-in `process` module, which provides interaction with the current Node.js process.  For more information, see [the section on this module](#the-process-module).

* `console`: Node's built-in `console` module, which wraps various standard input and output functionality in a browser-like way. For more information, see [the section on this module](#the-console-module).

* `setTimeout()`, `clearTimeout()`, `setInterval()`, `clearInterval()`: These built-in timer functions are globals. Fore more information, see [the section on using timer functions](#what-are-the-built-in-timer-functions).

As mentioned above, there are also a number of pseudo-globals included at the module level in every module:

* `module`, `module.exports`, `exports`: These objects all pertain to Node's module system. For more information see [the section about requiring modules](#what-is-require). Tangential to this is `require()`, which is a built-in function, exposed per-module, that allows other valid modules to be included.

* `__filename`: The `__filename` keyword contains the path of the currently executing file.  **Note**: this is not defined while running the [Node.js REPL](#how-to-use-nodejs-repl).

* `__dirname`: Like `__filename`, the `__dirname` keyword contains the path to the root directory of the currently executing script. This is also not present in the Node.js REPL.

Much of this functionality can be extremely useful for a Node.js developer's daily life&mdash;but at the very least, remember these as bad names to use for your own functions! 
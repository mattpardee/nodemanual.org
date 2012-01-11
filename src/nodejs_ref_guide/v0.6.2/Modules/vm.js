/**
 * class vm
 *
 *
 * In Node.js, Javascript code can be compiled and run immediately or compiled, saved, and run later. To do that, you can add `require('vm');` to your code.
 *
 * #### Example
 *
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=vm.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 *
 **/

/**
 * vm.runInThisContext(code [, filename]) -> String
 * - code (String):  The code to run
 * - filename (String): A filename to emulate where the code is coming from 
 * 
 * `vm.runInThisContext()` compiles `code` as if it were loaded from `filename`, runs it, and returns the result. Running code does not have access to local scope.
 *
 * In case of syntax error in `code`, `vm.runInThisContext()` emits the syntax error to stderr and throws an exception.
 * 
 * #### Example: Using `vm.runInThisContext` and `eval` to run the same code:
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=vm.runInThisContext.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 * 
 * Since `vm.runInThisContext()` doesn't have access to the local scope, `localVar` is unchanged. `eval` does have access to the local scope, so `localVar` is changed.
 * 
 * #### Returns
 *
 * A string representing the result of running `code`.
 *
**/ 


/**
 * vm.runInNewContext(code [, sandbox] [, filename]) -> Void
 * - code (String): The code to run
 * - sandbox (Object): A global object with properties to pass into `code`
 * - filename (String):  A filename to emulate where the code is coming from
 * 
 * `vm.runInNewContext()` compiles `code` to run in `sandbox` as if it were loaded from `filename`, then runs it and returns the result. Running code does not have access to local scope and the object `sandbox` will be used as the global object for `code`.
 * 
 * <Warning>Running untrusted code is a tricky business requiring great care.  To prevent accidental global variable leakage, `vm.runInNewContext()` is quite useful, but safely running untrusted code requires a separate process.</Warning>
 * 
 * In case of syntax error in `code`, `vm.runInNewContext()` emits the syntax error to stderr and throws an exception.
 * 
 * #### Example
 * 
 * Here's an example to ompile and execute code that increments a global variable and sets a new one. These globals are contained in the sandbox.
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=vm.runInNewContext.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 * 
**/ 


/**
 * vm.runInContext(code, context [, filename]) -> String
 * - code (String): The code to run
 * - context (Object): The context to execute it in, coming from [[vm.createContext `vm.createContext()`]]
 * - filename (String): A filename to emulate where the code is coming from
 * 
 * `vm.runInContext()` compiles `code` to run in `context` as if it were loaded from `filename`, then runs it and returns the result. 
 * 
 * A (V8) context comprises a global object, together with a set of built-in objects and functions. Running code does not have access to local scope and the global object held within `context` will be used as the global object for `code`.
 * 
 * In case of syntax error in `code`, `vm.runInContext()` emits the syntax error to stderr and throws an exception.
 * 
 * <Note>Running untrusted code is a tricky business requiring great care.  To prevent accidental global variable leakage, `vm.runInContext()` is quite useful, but safely running untrusted code requires a separate process.</Note>
 * 
 * #### Example
 * 
 * Compiling and executing code in an existing context.
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=vm.runInContext.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 * 
 * #### Returns
 *
 * A string representing the result of running `code`.
 *
**/ 


/**
 * vm.createContext([initSandbox]) -> Object
 * - initSandbox (Object): An object that is shallow-copied to seed the initial contents of the global object used by the context
 * 
 * `vm.createContext()` creates a new context which is suitable for use as the second argument of a subsequent call to `vm.runInContext()`. 
 * 
 * A (V8) context comprises a global object together with a set of build-in objects and functions.
 * 
**/ 


/**
 * vm.createScript(code [, filename]) -> vm.Script
 * - code (String): The code to run
 * - filename (String): A filename to emulate where the code is coming from
 * 
 * 
 * This script can be run later many times using the other `vm` methods. In case of syntax error in `code`, `createScript` prints the syntax error to stderr and throws an exception.
 * 
 *
 * `createScript()` compiles `code` as if it were loaded from `filename`, but does not run it. Instead, it returns a `vm.Script` object representing this compiled code. The returned script is not bound to any global object. It is bound before each run, just for that run.
 *
**/ 


/**
 * class vm.Script
 *
**/

/**
 * vm.Script.runInThisContext() -> String
 *
 * Similar to `vm.runInThisContext()`, but a method of the precompiled `Script` object.
 * 
 * `script.runInThisContext()` runs the code of `script` and returns the result. Running code doesn't have access to local scope, but does have access to the `global` object.
 * 
 * #### Example
 * 
 * Using `script.runInThisContext()` to compile code once and run it multiple times:
 * 
 *     var vm = require('vm');
 * 
 *     globalVar = 0;
 * 
 *     var script = vm.createScript('globalVar += 1', 'myfile.vm');
 * 
 *     for (var i = 0; i < 1000 ; i += 1) {
 *       script.runInThisContext();
 *     }
 * 
 *     console.log(globalVar);
 * 
 *     //prints: 1000
 * 
 * #### Returns
 *
 * A string representing the result of running `code`.
 *
**/ 


/**
 * vm.Script.runInNewContext([sandbox]) -> String
 * - sandbox (Object): A global object with properties to pass into the `Script` object
 * 
 * Similar to `vm.runInNewContext()`, this is a method of a precompiled `Script` object.
 * 
 * `script.runInNewContext()` runs the code of `script` with `sandbox` as the global object and returns the result. Running code does not have access to local scope.
 * 
 * <Warning>Running untrusted code is a tricky business requiring great care.  To prevent accidental global variable leakage, `script.runInNewContext()` is quite useful, but safely running untrusted code requires a separate process.</Warning>
 * 
 * #### Example
 * 
 * Compiling code that increments a global variable and sets one, then execute the code multiple times:
 * 
 *     var util = require('util'),
 *         vm = require('vm'),
 *         sandbox = {
 *           animal: 'cat',
 *           count: 2
 *         };
 * 
 *     var script = vm.createScript('count += 1; name = "kitty"', 'myfile.vm');
 * 
 *     for (var i = 0; i < 10 ; i += 1) {
 *       script.runInNewContext(sandbox);
 *     }
 * 
 *     console.log(util.inspect(sandbox));
 * 
 *     // prints: { animal: 'cat', count: 12, name: 'kitty' }
 * 
 * #### Returns
 *
 * A string representing the result of running `code`.
 *
**/ 


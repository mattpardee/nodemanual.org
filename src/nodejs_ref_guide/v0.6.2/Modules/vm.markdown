## Executing JavaScript

Javascript code can be compiled and run immediately or compiled, saved, and run later. You can access this module by adding `require('vm');` to your code.

### Methods

@method `vm.runInThisContext(code, [filename])`
@param `code`: The code to run, `filename`: A filename to emulate where the code is coming from

`vm.runInThisContext()` compiles `code` as if it were loaded from `filename`, runs it and returns the result. Running code does not have access to local scope.

#### Example

Example of using `vm.runInThisContext` and `eval` to run the same code:

    var localVar = 123,
        usingscript, evaled,
        vm = require('vm');

    usingscript = vm.runInThisContext('localVar = 1;', 'myfile.vm');
    console.log('localVar: ' + localVar + ', usingscript: ' + usingscript);
    
    evaled = eval('localVar = 1;');
    console.log('localVar: ' + localVar + ', evaled: ' + evaled);

    // localVar: 123, usingscript: 1
    // localVar: 1, evaled: 1

Since `vm.runInThisContext()` doesn't have access to the local scope, `localVar` is unchanged. `eval` does have access to the local scope, so `localVar` is changed.

In case of syntax error in `code`, `vm.runInThisContext()` emits the syntax error to stderr and throws an exception.

@method ` vm.runInNewContext(code, [sandbox], [filename])`
@param `code`: The code to run, `sandbox`: A global object with properties to pass into `code`, `filename`: A filename to emulate where the code is coming from

`vm.runInNewContext()` compiles `code` to run in `sandbox` as if it were loaded from `filename`, then runs it and returns the result. Running code does not have access to local scope and the object `sandbox` will be used as the global object for `code`.

<span class="label success">Note</span> Running untrusted code is a tricky business requiring great care.  To prevent accidental global variable leakage, `vm.runInNewContext()` is quite useful, but safely running untrusted code requires a separate process.

In case of syntax error in `code`, `vm.runInNewContext()` emits the syntax error to stderr and throws an exception.

#### Exmaple

Here's an example to ompile and execute code that increments a global variable and sets a new one. These globals are contained in the sandbox.

    var util = require('util'),
        vm = require('vm'),
        sandbox = {
          animal: 'cat',
          count: 2
        };

    vm.runInNewContext('count += 1; name = "kitty"', sandbox, 'myfile.vm');
    console.log(util.inspect(sandbox));

    // { animal: 'cat', count: 3, name: 'kitty' }

@method `vm.runInContext(code, context, [filename])`
@param `code`: The code to run, `context`: The context to execute it in, `filename`: A filename to emulate where the code is coming from

`vm.runInContext()` compiles `code` to run in `context` as if it were loaded from `filename`, then runs it and returns the result. 

A (V8) context comprises a global object, together with a set of built-in objects and functions. Running code does not have access to local scope and the global object held within `context` will be used as the global object for `code`.

<span class="label success">New</span> Running untrusted code is a tricky business requiring great care.  To prevent accidental global variable leakage, `vm.runInContext()` is quite useful, but safely running untrusted code requires a separate process.

In case of syntax error in `code`, `vm.runInContext()` emits the syntax error to stderr and throws an exception.

#### Example

Compiling and executing code in an existing context.

    var util = require('util'),
        vm = require('vm'),
        initSandbox = {
          animal: 'cat',
          count: 2
        },
        context = vm.createContext(initSandbox);

    vm.runInContext('count += 1; name = "CATT"', context, 'myfile.vm');
    console.log(util.inspect(context));

    // { animal: 'cat', count: 3, name: 'CATT' }

@method `vm.createContext([initSandbox])`
@param `[initSandbox]`: An object that is shallow-copied to seed the initial contents of the global object used by the context

`vm.createContext()` creates a new context which is suitable for use as the second argument of a subsequent call to `vm.runInContext()`. 

A (V8) context comprises a global object together with a set of build-in objects and functions.

@method `vm.createScript(code, [filename])`
@param `code`: The code to run, `filename`: A filename to emulate where the code is coming from

`createScript()` compiles `code` as if it were loaded from `filename`, but does not run it. Instead, it returns a `vm.Script` object representing this compiled code. The returned script is not bound to any global object. It is bound before each run, just for that run.

This script can be run later many times using the other `vm` methods.
In case of syntax error in `code`, `createScript` prints the syntax error to stderr and throws an exception.

### Object

@obj `vm.Script`

@method `script.runInThisContext()`

Similar to `vm.runInThisContext()`, but a method of the precompiled `Script` object.

`script.runInThisContext()` runs the code of `script` and returns the result. Running code does not have access to local scope, but does have access to the `global` object.

#### Example

Using `script.runInThisContext()` to compile code once and run it multiple times:

    var vm = require('vm');

    globalVar = 0;

    var script = vm.createScript('globalVar += 1', 'myfile.vm');

    for (var i = 0; i < 1000 ; i += 1) {
      script.runInThisContext();
    }

    console.log(globalVar);

    // 1000


@method `script.runInNewContext([sandbox])`
@param `sandbox`: A global object with properties to pass into the `Script` object

Similar to `vm.runInNewContext()`, this is a method of a precompiled `Script` object.

`script.runInNewContext()` runs the code of `script` with `sandbox` as the global object and returns the result. Running code does not have access to local scope.

<span class="label success">New</span> Running untrusted code is a tricky business requiring great care.  To prevent accidental global variable leakage, `script.runInNewContext()` is quite useful, but safely running untrusted code requires a separate process.

#### Example

Compiling code that increments a global variable and sets one, then execute the code multiple times:

    var util = require('util'),
        vm = require('vm'),
        sandbox = {
          animal: 'cat',
          count: 2
        };

    var script = vm.createScript('count += 1; name = "kitty"', 'myfile.vm');

    for (var i = 0; i < 10 ; i += 1) {
      script.runInNewContext(sandbox);
    }

    console.log(util.inspect(sandbox));

    // { animal: 'cat', count: 12, name: 'kitty' }


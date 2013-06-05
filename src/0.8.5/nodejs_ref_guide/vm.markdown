## vm

> Stability: 2 - Unstable
    
In Node.js, Javascript code can be compiled and run immediately or compiled,
saved, and run later. To do that, you can add `require('vm');` to your code.

#### Caveats

The `vm` module has many known issues and edge cases. If you run into
issues or unexpected behavior, please consult
[the open issues on GitHub](https://github.com/joyent/node/issues/search?q=vm).
Some of the biggest problems are described below.

#### Sandboxes

The `sandbox` argument to `vm.runInNewContext` and `vm.createContext`,
along with the `initSandbox` argument to `vm.createContext`, do not
behave as one might normally expect and their behavior varies
between different versions of Node.

The key issue to be aware of is that V8 provides no way to directly
control the global object used within a context. As a result, while
properties of your `sandbox` object will be available in the context,
any properties from the `prototype`s of the `sandbox` may not be
available. Furthermore, the `this` expression within the global scope
of the context evaluates to the empty object (`{}`) instead of to
your sandbox.

Your sandbox's properties are also not shared directly with the script.
Instead, the properties of the sandbox are copied into the context at
the beginning of execution, and then after execution, the properties
are copied back out in an attempt to propagate any changes.

#### Globals

Properties of the global object, like `Array` and `String`, have
different values inside of a context. This means that common
expressions like `[] instanceof Array` or
`Object.getPrototypeOf([]) === Array.prototype` may not produce
expected results when used inside of scripts evaluated via the `vm` module.

Some of these problems have known workarounds listed in the issues for
`vm` on GitHub. for example, `Array.isArray` works around
the example problem with `Array`.

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/vm/vm.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>


### vm.runInThisContext(code [, filename]), String
- code {String}   The code to run
- filename {String}  A filename to emulate where the code is coming from 

`vm.runInThisContext()` compiles `code` as if it were loaded from `filename`,
runs it, and returns the result. Running code does not have access to local
scope. The `filename` is optional, and is only used in stack traces.

In case of syntax error in `code`, `vm.runInThisContext()` emits the syntax
error to stderr and throws an exception.

#### Example: Using `vm.runInThisContext` and `eval` to run the same code:

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/vm/vm.runInThisContext.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

Since `vm.runInThisContext()` doesn't have access to the local scope, `localVar`
is unchanged. `eval` does have access to the local scope, so `localVar` is
changed.

#### Returns

A string representing the result of running `code`.

 


### vm.runInNewContext(code [, sandbox] [, filename])
- code {String}  The code to run
- sandbox {Object}  A global object with properties to pass into `code`
- filename {String}   A filename to emulate where the code is coming from

`vm.runInNewContext()` compiles `code` then runs it in `sandbox` and returns the
result. Running code does not have access to local scope. The object `sandbox`
is used as the global object for `code`.
`sandbox` and `filename` are optional, and `filename` is only used in stack
traces.

Warning: Running untrusted code is a tricky business requiring great care.  To
prevent accidental global variable leakage, `vm.runInNewContext()` is quite
useful, but safely running untrusted code requires a separate process.

In case of syntax error in `code`, `vm.runInNewContext()` emits the syntax error
to stderr and throws an exception.

#### Example

Here's an example to ompile and execute code that increments a global variable
and sets a new one. These globals are contained in the sandbox.

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/vm/vm.runInNewContext.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>
 


### vm.runInContext(code, context [, filename]), String
- code {String}  The code to run
- context {Object}  The context to execute it in, coming from [[vm.createContext
`vm.createContext()`]]
- filename {String}  A filename to emulate where the code is coming from
+ {String} A string representing the result of running `code`.

`vm.runInContext()` compiles `code`, then runs it in `context` and returns the
result.

A (V8) context comprises a global object, together with a set of built-in
objects and functions. Running code does not have access to local scope and the
global object held within `context` is used as the global object for `code`. The
`filename` is optional, and is only used in stack traces.

In case of syntax error in `code`, `vm.runInContext()` emits the syntax error to
stderr and throws an exception.

Note: Running untrusted code is a tricky business requiring great care.  To 
prevent accidental global variable leakage, `vm.runInContext()` is quite useful, 
but safely running untrusted code requires a separate process.

#### Example

Compiling and executing code in an existing context.

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/vm/vm.runInContext.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>



### vm.createContext([initSandbox]), Object
- initSandbox {Object}  An object that is shallow-copied to seed the initial
contents of the global object used by the context

`vm.createContext()` creates a new context which is suitable for use as the
second argument of a subsequent call to `vm.runInContext()`. 

A (V8) context comprises a global object together with a set of build-in objects
and functions.

### vm.createScript(code [, filename]), vm.Script
- code {String}  The code to run
- filename {String}  A filename to emulate where the code is coming from


This script can be run later many times using the other `vm` methods. In case of
syntax error in `code`, `createScript` prints the syntax error to stderr and
throws an exception.


`createScript()` compiles `code` as if it were loaded from `filename`, but does
not run it. Instead, it returns a `vm.Script` object representing this compiled
code. The returned script is not bound to any global object. It is bound before
each run, just for that run. The `filename` is optional, and is only used in
stack traces.

 
## vm.Script

This object is created as a result of the [[vm.createScript
`vm.createScript()`]] method. It represents some compiled code than can be run
at a later moment.




### vm.Script.runInThisContext(), String

Similar to `vm.runInThisContext()`, but a method of the precompiled `Script`
object.

`script.runInThisContext()` runs the code of `script` and returns the result.
Running code doesn't have access to local scope, but does have access to the
`global` object.

#### Example

Using `script.runInThisContext()` to compile code once and run it multiple
times:

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/vm/vm.Script.runInThisContext.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

#### Returns

A string representing the result of running `code`.

 


### vm.Script.runInNewContext([sandbox]), String
- sandbox {Object}  A global object with properties to pass into the `Script`
object

Similar to `vm.runInNewContext()`, this is a method of a precompiled `Script`
object.

`script.runInNewContext()` runs the code of `script` with `sandbox` as the
global object and returns the result. Running code does not have access to local
scope.

Warning: Running untrusted code is a tricky business requiring great care.  To
prevent accidental global variable leakage, `script.runInNewContext()` is quite
useful, but safely running untrusted code requires a separate process.

#### Example

Compiling code that increments a global variable and sets one, then execute the
code multiple times:

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/vm/vm.Script.runInNewContext.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

#### Returns

A string representing the result of running `code`.

 


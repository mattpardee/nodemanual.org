/** section: Global_Objects
* Global_Objects
*
* These objects are available to all modules. Some of these objects aren't actually in the global scope, but in the module scope; they'll be noted as such below.
* 
* ### `__dirname`
* 
* The name of the directory that the currently executing script resides in. 
* 
* `__dirname` isn't actually on the global scope, but is local to each module.
* 
* 	##### Example
* 
* 	If you're running `node example.js` from `/Users/mjr`:
* 
*     console.log(__dirname);
*     // prints /Users/mjr
* 
* ### `__filename`
* 
* The filename of the code being executed.  This is the resolved absolute path of this code file.  For a main program this is not necessarily the same filename used in the command line.  The value inside a module is the path to that module file.
* 
* `__filename` isn't actually on the global scope, but is local to each module.
* 
* 	##### Example
* 
* 	If you're running `node example.js` from `/Users/mjr`:
* 
*     	console.log(__filename);
*     	// prints /Users/mjr/example.js
*     
* ### Buffer
* 
* 	Used to handle binary data. See the [buffers](buffers.html) section for more information.
* 
* ### `console`
* 
* Used to print to stdout and stderr. See the [stdio](stdio.html) section for more information.
* 
* ### `exports`
* 
* An object which is shared between all instances of the current module and made accessible through `require()`.
*
* `exports` is the same as the `module.exports` object. See `src/node.js` for more information.
* 
* `exports` isn't actually on the global scope, but is local to each module.
* 
*
* ### `global`
* 
* The global namespace object.
* 
* In browsers, the top-level scope is the global scope. That means that in browsers if you're in the global scope `var something` will define a global variable. In Node.js this is different. The top-level scope is not the global scope; `var something` inside a Node.js module is local only to that module.
* 
*
* ### `module`
* 
* A reference to the current module. In particular `module.exports` is the same as the `exports` object. See `src/node.js` for more information.
* 
* `module` isn't actually on the global scope, but is local to each module.
* 
*
* ### `process`
* 
* The process object. See the [process object](process.html) section for more information.
* 
*
*
* ### `require()`
* 
* This is necessary to require modules. See the [Modules](modules.html) section for more information.
* 
* `require` isn't actually on the global scope, but is local to each module.
* 
*
* ### `require.cache`
* 
* Modules are cached in this object when they are required. By deleting a key value from this object, the next `require` will reload the module.
* 
* 
*
* ### `require.resolve()`
* 
* Use the internal `require()` machinery to look up the location of a module, but rather than loading the module, just return the resolved filename.
* 
*
* 
* ### `setTimeout(cb, ms)`
* ### `clearTimeout(t)`
* ### `setInterval(cb, ms)`
* ### `clearInterval(t)`
* 
* These timer functions are all global variables. See the [timers](timers.html) section for more information.
* 
**/
# Globals
({"type": "misc"})

These objects are available to all modules. Some of these objects aren't
actually in the global scope, but in the module scope; they'll be noted as such
below.

<dl> 
<dt><code>__dirname</code></dt>
<dd>The name of the directory that the currently executing script resides in.
<code>__dirname</code> isn't actually on the global scope, but is local to each
module.</dd>
<dd>For example, if you're running <code>node example.js</code> from <code>/Users/mjr</code>:
    
<pre class="prettyprint">
    console.log(__dirname);
    // prints /Users/mjr
</pre>
</dd>

<dt><code>__filename</code></dt>
<dd>The filename of the code being executed.  This is the resolved absolute path
of this code file.  For a main program this is not necessarily the same filename
used in the command line.  The value inside a module is the path to that module
file.</dd>
<dd><code>__filename</code> isn't actually on the global scope, but is local to each
module.</dd>
<dd>For example, if you're running <code>node example.js</code> from <code>/Users/mjr</code>:
   
<pre class="prettyprint"> 
    console.log(__filename);
    // prints /Users/mjr/example.js
</pre>
</dd>

<dt>Buffer</dt>
<dd>Used to handle binary data. See the [[Buffer Buffers]] section for more
information.</dd>

<dt><code>console</code></dt>
<dd>Used to print to stdout and stderr. See the [[console STDIO]] section for
more information.</dd>

<dt><code>exports</code></dt>
<dd>An object which is shared between all instances of the current module and
made accessible through <code>require()</code>.</dd>
<dd><code>exports</code> is the same as the <code>module.exports</code> object. See <code>src/node.js</code> for
more information.</dd>
<dd><code>exports</code> isn't actually on the global scope, but is local to each
module.</dd>
<dd>See the [module system documentation][modules.html] for more information.</dd>

<dt><code>global</code></dt>
<dd>The global namespace object.</dd>
<dd>In browsers, the top-level scope is the global scope. That means that in
browsers if you're in the global scope <code>var something</code> will define a global
variable. In Node.js this is different. The top-level scope is not the global
scope; <code>var something</code> inside a Node.js module is local only to that
module.</dd>

<dt><code>module</code></dt>
<dd>A reference to the current module. In particular <code>module.exports</code> is the
same as the <code>exports</code> object. See <code>src/node.js</code> for more information.</dd>
<dd><code>module</code> isn't actually on the global scope, but is local to each
module.</dd>
<dd>See the [module system documentation][modules.html] for more information.</dd>

<dt><code>process</code></dt>
<dd>The process object. See the [process object](process.html) section for more
information.</dd>

<dt><code>require()</code></dt>
<dd>This is necessary to require modules. See the [Modules](modules.html)
section for more information.</dd>
<dd><code>require</code> isn't actually on the global scope, but is local to each
module.</dd>

<dt><code>require.extensions</code></dt>
<dd>An [[Array array]] that instructs `require` on how to handle certain file extensions.

For example, to process files with the extension <code>.sjs</code> as <code>.js</code>:

    require.extensions['.sjs'] = require.extensions['.js'];

Or, to write your own extension handler:

    require.extensions['.sjs'] = function(module, filename) {
      var content = fs.readFileSync(filename, 'utf8');
      // Parse the file content and give to module.exports
      module.exports = content;
    };</dd>

<dt><code>require.cache</code></dt>
<dd>Modules are cached in this object when they are required. By deleting a key
value from this object, the next <code>require</code> will reload the module.</dd>

<dt><code>require.resolve()</code></dt>
<dd>Use the internal <code>require()</code> machinery to look up the location of a module,
but rather than loading the module, just return the resolved filename.</dd>

<dt><code>setTimeout(cb, ms)</code><br/>
<code>clearTimeout(t)</code><br/>
<code>setInterval(cb, ms)</code><br/>
<code>clearInterval(t)</code></dt>
<dd>These timer functions are all global variables. See the [[timer <code>Timers</code>]]
section for more information.</dd>
</dl>

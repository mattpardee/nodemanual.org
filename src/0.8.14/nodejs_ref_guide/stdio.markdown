## console
({"type": "global"})

> Stability: 3 - Stable
    
These methods are useful for printing to stdout and stderr. They are similar to
the `console` object functions provided by most web browsers. The `console`
object is global, so you don't need to `require` anything.

It's important to note that printing to stdout and stderr is synchronous, and
therefore, blocking.


### console.assert(expression, [message])
(alias of: assert.ok)


### console.dir(obj)
- obj {Object}  An object to inspect
(alias of: util.inspect)

Uses [[util.inspect `util.inspect()`]] on `obj` and prints the resulting string
to stdout.


### console.warn([data...])
- data {String}  A message to send
(related to: console.log)

This performs the same role as `console.log()`, but prints to stderr instead.


### console.error([data...])
- data {Object}  A message to send
(related to: console.log)

This performs the same role as `console.log()`, but prints to stderr instead.



### console.info([data...])
(alias of: console.log)

This is just an alias to [[console.log `console.log()`]].


### console.log([data...])
- data {String}   The string to print, and any additional formatting arguments
(alias of: util.format)

Prints to stdout with a newline. This function can take multiple arguments in 
[a `printf()`-like](http://en.wikipedia.org/wiki/Printf_format_string#Format_placeholders) way.
     
Each placeholder is replaced with the converted value from its corresponding
argument. Supported placeholders are:

* `%s` - String.
* `%d` - Number (both integer and float).
* `%j` - JSON.
* `%%` - single percent sign (`'%'`). This does not consume an argument.

If formatting elements are not found in the first string then [[util.inspect
`util.inspect()`]] is used on each argument. 

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/console/console.log.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### console.time(label)
- label {String}  An identifying string
(related to: console.timeEnd)

Marks a time by printing it out to the console. This is used in conjunction with
`console.timeEnd()`.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/console/console.time.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>


### console.timeEnd(label)
- label {String}  An identifying string
(related to: console.time)

Finish the previous timer and prints output.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/console/console.time.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

console.trace(label)

Prints a stack trace to stderr of the current position.
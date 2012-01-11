/**
 * class console
 * 
 * These methods are useful for printing to stdout and stderr. They are similar to the `console` object functions provided by most web browsers. The `console` object is global, so you don't need to `require` anything.
 * 
 * It's important to note that printing to stdout and stderr is synchronous, and therefore, blocking.
 * 
 **/


/** alias of: assert.ok
 * console.assert() -> Void
 *
 * An alias to `assert.ok()`.
**/ 


/** alias of: util.inspect
 * console.dir(obj) -> Void
 * - obj (Object): An object to inspect
 * 
 * Uses [[util.inspect `util.inspect()`]] on `obj` and prints the resulting string to stderr.
 * 
**/ 


/** related to: console.log
 * console.warn([arg...]) -> Void
 * - warn (String): A message to send
 * 
 * This performs the same role as `console.log()`, but prints to stderr instead.
 * 
**/ 

/** related to: console.log
 * console.error([arg...]) -> Void
 * - obj (Object): An object to inspect
 * 
 * This performs the same role as `console.log()`, but prints to stderr instead.
 * 
**/ 


/** alias of: console.log
 * console.info() -> Void
 *
 * This is just an alias to `console.log()`.
 * 
**/ 


/** alias of: util.format
 * console.log([arg...]) -> Void
 * - arg (String):  The string to print, and any additional formatting arguments
 * 
 * Prints to stdout with a newline. This function can take multiple arguments in [a `printf()`-like](http://en.wikipedia.org/wiki/Printf_format_string#Format_placeholders) way.
 *      
 * Each placeholder is replaced with the converted value from its corresponding argument. Supported placeholders are:
 * 
 * * `%s` - String.
 * * `%d` - Number (both integer and float).
 * * `%j` - JSON.
 * * `%%` - single percent sign (`'%'`). This does not consume an argument.
 * 
 * If formating elements are not found in the first string then [[util.inspect `util.inspect()`]] is used on each argument. 
 *
 * #### Example
 *
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=console.log.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 * 
**/ 


/** related to: console.timeEnd
 * console.time(label) -> Void
 * - label (String): An identifying string
 * 
 * Marks a time by printing it out to the console. This is used in conjunction with `console.timeEnd()`.
 * 
 * #### Example
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=console.time.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 * 
**/ 


/** related to: console.time
 * console.timeEnd(label) -> Void
 * - label (String): An identifying string
 * 
 * Finish the previous timer and prints output.
 * 
 * #### Example
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=console.time.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 * 
**/ 


/**
 * console.trace() -> Void
 *
 * Prints a stack trace to stderr of the current position.
 *
**/ 


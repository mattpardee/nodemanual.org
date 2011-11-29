## Printing to Console

These methods are useful for printing to stdout and stderr. They are similar to the `console` object functions provided by most web browsers.

It's important to note that printing to stdout and stderr us synchronous, and therefore, blocking.

### Methods

@method `console.assert()`

An alias to `assert.ok()`.

@method `console.dir(obj)`
@param `obj`: An object to inspect

Uses `util.inspect()` on `obj` and prints the resulting string to stderr.

@method `console.error()`

This performs the same role as `console.log()`, but prints to stderr instead.

@method `console.info()`

This is just an alias to `console.log()`.

@method `console.log([arg...])`
@param `[arg]`: The string to print, and any additional formatting arguments

Prints to stdout with a newline. This function can take multiple arguments in a
`printf()`-like way. For example:

    console.log('count: %d', count);

If formating elements are not found in the first string then `util.inspect` is used on each argument. For way more information, see [`util.format()`](util.html#util.format).

@method `console.time(label)`
@param `label`: An identifing string 

Marks a time by printing it out to the console. This is used in conjunction with `console.time()`.

#### Example

    console.time('elements');
    for (var i = 0; i < 1000000; i++) {
      ;
    }
    console.timeEnd('elements');
    // print 4ms
    
@method `console.timeEnd(label)`
@param `label`: An identifying string

Finish the previous timer and prints output.

#### Example

    console.time('elements');
    for (var i = 0; i < 1000000; i++) {
      ;
    }
    console.timeEnd('elements');
    // prints 4ms

@method `console.trace()`

Prints a stack trace to stderr of the current position.

@method `console.warn()`

This performs the same role as `console.log()`, but prints to stderr instead.
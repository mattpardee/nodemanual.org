## tty

> Stability: 2 - Unstable
    
The `tty` module houses the `tty.ReadStream` and `tty.WriteStream` classes. In
most cases, you will not need to use this module directly.

When node detects that it is being run inside a TTY context, then `process.stdin`
will be a `tty.ReadStream` instance and `process.stdout` will be
a `tty.WriteStream` instance. The preferred way to check if node is being run in
a TTY context is to check `process.stdout.isTTY`:

    $ node -p -e "Boolean(process.stdout.isTTY)"
    true
    $ node -p -e "Boolean(process.stdout.isTTY)" | cat
    false


### tty.isatty(fd), Boolean
- fd {Number}   The file descriptor to check

Returns `true` or `false` depending on if the file descriptor is associated with
a terminal.

### tty.setRawMode(mode)
- mode {Boolean}  A boolean value indicating how to set the rawness
(deprecated)

Deprecated. Use [[tty.ReadStream.setRawMode `tty.ReadStream.setRawMode()`]] 
instead.

## tty.ReadStream

A `net.Socket` subclass that represents the readable portion of a tty. In normal
circumstances, `process.stdin` is the only `tty.ReadStream` instance in any
Node.js program (only when `isatty(0)` is true).

### tty.ReadStream.isRaw, Boolean

Represents the current "raw" state of the `tty.ReadStream` instance. Initialized
to `false`.

### tty.ReadStream.setRawMode(mode)
- mode {Boolean} Sets the raw state of the `tty.ReadStream` instance

Sets the properties of the `tty.ReadStream` to act either as a raw device or 
default. `isRaw` will be set to the resulting mode.


## tty.WriteStream

A `net.Socket` subclass that represents the writable portion of a tty. In normal
circumstances, `process.stdout` will be the only `tty.WriteStream` instance
ever created (and only when `isatty(1)` is true).

### tty.WriteStream.columns, Number

Returns the number of columns the TTY currently has. This property is updated on
"resize" events.

### tty.WriteStream.rows, Number

Returns the number  of rows the TTY currently has. This property is updated on 
"resize" events.

### tty.WriteStream@resize

Emitted by `refreshSize()` when either of the `columns` or `rows` properties
has changed.

#### Example

    process.stdout.on('resize', function() {
      console.log('screen size has changed!');
      console.log(process.stdout.columns + 'x' + process.stdout.rows);
    });

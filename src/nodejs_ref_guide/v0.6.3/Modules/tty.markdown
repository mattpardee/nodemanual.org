## TTY

Use `require('tty')` to access this module.

Here's an example:

    var tty = require('tty');
    process.stdin.resume();
    tty.setRawMode(true);
    process.stdin.on('keypress', function(char, key) {
      if (key && key.ctrl && key.name == 'c') {
        console.log('graceful exit');
        process.exit()
      }
    });


### Methods

@method `tty.getWindowSize(fd)`
@param `fd`: The file descriptor to check
@deprecated v0.6.0

This function was removed in v0.6.0. Use `process.stdout.getWindowSize()` instead.

Returns an array of `[row, col]` for the TTY associated with the file descriptor.

@method `tty.isatty(fd)`
@param `fd`: The file descriptor to check

Returns `true` or `false` depending on if the `fd` is associated with a terminal.

@method `tty.setRawMode(mode)`
@param `mode`: A boolean value indicating how to set the rawness

This sets the properties of the current process's stdin fd to act either as a raw device (`true`) or default (`false`).

@method `tty.setWindowSize(fd, row, col)`
@param `fd`: The file descriptor to use, `row`: The number of rows, `col`: The number of columns
@deprecated v0.6.0

This function was removed in v0.6.0. Use `process.stdout.setWindowSize()` instead.

Defines the window size settings to the file descriptor.

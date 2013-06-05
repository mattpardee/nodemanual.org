## tty

> Stability: 3 - Stable
    
This module controls printing to the terminal output. Use `require('tty')` to
access this module.

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/tty/tty.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### tty.getWindowSize(fd), Array
- fd {Number}   The file descriptor to check
(deprecated: 0.6.0)

This function no longer exists. Use [[process.stdout
`process.stdout.getWindowSize()`]] instead.

### tty.isatty(fd), Boolean
- fd {Number}   The file descriptor to check

Returns `true` or `false` depending on if the file descriptor is associated with
a terminal.

### tty.setRawMode(mode)
- mode {Boolean}  A boolean value indicating how to set the rawness

This sets the properties of the current process's stdin file descriptor to act
either as a raw device (`true`) or default (`false`).

### tty.setWindowSize(fd, row, col)
- fd {Number}  The file descriptor to use
- row {Number}  The number of rows
- col {Number}  The number of columns
(deprecated: 0.6.0)

This function no longer exists.

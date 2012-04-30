/**
class tty

This module controls printing to the terminal output. Use `require('tty')` to access this module.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/tty/tty.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>
**/


/**
tty.isatty(fd) -> Boolean
- fd (Number):  The file descriptor to check

Returns `true` or `false` depending on if the file descriptor is associated with a terminal.

**/ 


/**
tty.setRawMode(mode) -> Void
- mode (Boolean): A boolean value indicating how to set the rawness

This sets the properties of the current process's stdin file descriptor to act either as a raw device (`true`) or default (`false`).

**/ 


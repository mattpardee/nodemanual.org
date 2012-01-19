# Executing Command Line Node.js via REPL

Node.js ships with a REPL, which is short for Read-Eval-Print Loop.  It is the Node.js shell; any valid Javascript which can be written in a script can be passed to the REPL. It can be extremely useful for experimenting with Node.js, debugging code, and figuring out some of Javascript's more eccentric behaviors.

Running it is simple: just type `node` without a filename:

     user:~/$ node

It then drops you into a simple prompt (`>`) where you can type any Javascript command you wish. As in most shells, you can press the up and down arrow keys to scroll through your command history and modify previous commands. The REPL also supports auto-completing commands by pressing Tab.

Whenever you type a command, REPL prints the return value of the command. If you want to reuse the previous return value, you can use the special `_` variable. For example:

     node
     > 1+1
     2
     > _+1
     3

One thing worth noting where REPL return values are concerned: when the `var` keyword is used, the value of the expression is stored, but _not_ returned.  When a bare identifier is used, the value is also returned, as well as stored. For example:

     > x = 10
     10
     > var y = 5
     > x
     10
     > y
     5

If you need to access any of the built-in modules, or any third party modules, they can be accessed with `require`, just like in the rest of Node.

For example:

     node
     > path = require('path')
     { resolve: [Function],
       normalize: [Function],
       join: [Function],
       dirname: [Function],
       basename: [Function],
       extname: [Function],
       exists: [Function],
       existsSync: [Function] }
     > path.basename("/a/b/c.txt")
     'c.txt'

Note once again that without the `var` keyword, the contents of the object are returned immediately and displayed to `stdout`.
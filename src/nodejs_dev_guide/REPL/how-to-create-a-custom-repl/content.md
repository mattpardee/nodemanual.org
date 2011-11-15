### Creating a Custom REPL

Node allows users to create their own REPLs with the [repl module](http://nodejs.org/docs/latest/api/repl.html). Its basic use looks like this:

    repl.start(prompt, stream);

`prompt` is a string that's used for the prompt of your REPL and defaults to "> ". `stream` is the stream that the REPL listens on and defaults to `process.stdin`. When you run `node` from the command prompt, it's actually running `repl.start()` to give you the standard REPL.

#### Advanced REPL Usage

The REPL is pretty flexible. Here's an example that shows this off:

    var net = require("net"),
        repl = require("repl");

    var mood = function () {
        var m = [ "^__^", "-___-;", ">.<", "<_>" ];
        return m[Math.floor(Math.random()*m.length)];
    };

    //A remote node repl that you can telnet to!
    net.createServer(function (socket) {
      var remote = repl.start("node::remote> ", socket);
      //Adding "mood" and "bonus" to the remote REPL's context.
      remote.context.mood = mood;
      remote.context.bonus = "UNLOCKED";
    }).listen(5001);

    console.log("Remote REPL started on port 5001.");

    //A "local" node repl with a custom prompt
    var local = repl.start("node::local> ");

    // Exposing the function "mood" to the local REPL's context.
    local.context.mood = mood;

This script creates _two_ REPLs. The `local` REPL is normal (except for its custom prompt), but the *other* is exposed via the `net` module so that you can telnet into it. In addition, it uses the `context` property to expose the function "mood" to both REPLs, and the "bonus" string to the remote REPL only. As you will see, this approach of trying to expose objects to one REPL and not the other **doesn't really work**.

In addition, all objects in the global scope will also be accessible to your REPLs.

Here's what happens when the script runs:

    $ node repl.js 
    Remote REPL started on port 5001.
    node::local> .exit
    ^Cuser:/tmp/telnet$ node repl.js 
    Remote REPL started on port 5001.
    node::local> mood()
    '^__^'
    node::local> bonus
    ReferenceError: bonus is not defined
        at [object Context]:1:1
        at Interface.<anonymous> (repl.js:171:22)
        at Interface.emit (events.js:64:17)
        at Interface._onLine (readline.js:153:10)
        at Interface._line (readline.js:408:8)
        at Interface._ttyWrite (readline.js:585:14)
        at ReadStream.<anonymous> (readline.js:73:12)
        at ReadStream.emit (events.js:81:20)
        at ReadStream._emitKey (tty_posix.js:307:10)
        at ReadStream.onData (tty_posix.js:70:12)

As may be seen, the `mood` function is usable within the local REPL, but the
`bonus` string is not. This is as expected.

Now, here's what happens when you try to telnet to port 5001:

    user:/tmp/telnet$ telnet localhost 5001
    Trying ::1...
    Trying 127.0.0.1...
    Connected to localhost.
    Escape character is '^]'.
    node::remote> mood()
    '>.<'
    node::remote> bonus
    'UNLOCKED'

As you can see, the `mood()`  and `bonus` functions are also available over telnet.

As an interesting consequence of these actions, `bonus()` is now also defined on the local REPL:

    node::local> bonus
    'UNLOCKED'

It seems we "unlocked" the `bonus` string on the local REPL as well. As it turns out, any variables created in one REPL are also available to the other:

    node::local> var str = "AWESOME!"

    node::remote> str
    'AWESOME!'

As you can see, the node REPL is powerful and flexible.
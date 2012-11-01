## child_process

> Stability: 3 - Stable

Node.js provides a tri-directional
[`popen(3)`](http://www.kernel.org/doc/man-pages/online/pages/man3/popen.3.html)
facility through the `child_process` module. It's possible to stream data
through the child's `stdin`, `stdout`, and `stderr` in a fully non-blocking way.

To create a child process object, use `require('child_process')` in your code.

Child processes always have three streams associated with them. They are:

* `child.stdin`, the standard input stream
* `child.stdout`, the standard output stream
* `child.stderr`, the standard error stream

#### Example: Running ls in a child process

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/child_process/child_process.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### child_process@exit(code, signal)
- code {Number} The final exit code of the process (otherwise, `null`)
- signal {String} The string name of the signal (otherwise, `null`)

This event is emitted after the child process ends. If the process terminated
normally, `code` is the final exit code of the process; otherwise, it's `null`. If
the process terminated due to receipt of a signal, `signal` is the string name
of the signal; otherwise, it's `null`.

Note that the child process stdio streams might still be open.

For more information, see
[waitpid(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/wait.2.html).

### child_process@close

This event is emitted when the stdio streams of a child process have all
terminated. This is distinct from `'exit'`, since multiple processes
might share the same stdio streams.

### child_process@disconnect

This event is emitted after using the [[child_process.disconnect `disconnect()`]] method in 
the parent or in the child. After disconnecting, it is no longer possible to send messages.
An alternative way to check if you can send messages is to see if the
[[child_process.connected `child_process.connected`]] property is `true`.

### child_process@message(message, sendHandle)
- message {Object} A parsed JSON object, or a primitive value
- sendHandle {net.Server | net.Socket} A handle object

Messages sent by [[child_process.send `send()`]] are obtained using this
`message` event.

### child_process.connected, Boolean

Returns `true` if a child process is connected.

### child_process.stdin, stream.WritableStream

A [[stream.WritableStream `Writable Stream`]] that represents the child
process's `stdin`. Closing this stream via [[stream.WritableStream.end
`stream.WritableStream.end()`]] often causes the child process to terminate.

### child_process.stdout, stream.ReadableStream

A [[stream.ReadableStream `Readable Stream`]] that represents the child
process's `stdout`.

### child_process.pid, Number

The PID of the child process.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/child_process/child.pid.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### child_process.spawn(command [, args] [, options])
- command {String} The Unix command to spawn
- args {String | Array} The command line arguments to pass
- options {Object}  Any additional options you want to transfer
(related to: child_process.exec)

Launches a new process for the given Unix `command`. You can pass command line
arguments through `args`. 

`options` specifies additional options, which are:

They refer to:

* `cwd`, a [[String string]], specifies the working directory from which the process is spawned
* `stdio`, either an [[Array array]] or [[String string]], containing the child's stdio configuration
* `customFds`, an [[Array array]], is **deprecated**. They were file descriptors for the child to use for stdio
* `env`, an [[Object object]], specifies environment variables that will be visible to the new process
* `detached`, a [[Boolean boolean]], identifying if the child will be a process group leader

This object defaults to:

    { 
      cwd: undefined,
      env: process.env
    }

Note that if `spawn()` receives an empty `options` object, it spawns the process
with an empty environment rather than using [[process.env `process.env`]]. This
is due to backwards compatibility issues with a deprecated API.

##### About `stdio`

The 'stdio' option to `child_process.spawn()` is an array where each
index corresponds to a file descriptor in the child.  The value is one of the following:

1. `'pipe'` - Create a pipe between the child process and the parent process.
   The parent end of the pipe is exposed to the parent as a property on the
   `child_process` object--as `ChildProcess.stdio[fd]`. Pipes created for
   fds 0 - 2 are also available as `ChildProcess.stdin`, `ChildProcess.stdout`
   and `ChildProcess.stderr`, respectively.
2. `'ipc'` - Create an IPC channel for passing messages or file descriptors
   between parent and child. A ChildProcess may have at most *one* IPC stdio
   file descriptor. Setting this option enables the [[child_process.send `child_process.send()`]] method.
   If the child writes JSON messages to this file descriptor, then this will
   trigger the child process' [[eventemitter.on `'on'`]] event.  If the child is a 
   Node.js program, then the presence of an IPC channel will enable 
   [[child_process.send `send()` and `'on'`.
3. `'ignore'` - Do not set this file descriptor in the child. Note that Node
   will always open fd 0 - 2 for the processes it spawns. When any of these is
   ignored, node will open `/dev/null` and attach it to the child's fd.
4. [[Stream `Stream`]] object - Share a readable or writable stream that refers to a tty,
   file, socket, or a pipe with the child process. The stream's underlying
   file descriptor is duplicated in the child process to the fd that 
   corresponds to the index in the `stdio` array.
5. Positive integer - The integer value is interpreted as a file descriptor 
   that is is currently open in the parent process. It is shared with the child
   process, similar to how `Stream` objects can be shared.
6. `null` or `undefined` - Use default value. For stdio fds 0, 1 and 2 (in other
   words, stdin, stdout, and stderr) a pipe is created. For fd 3 and up, the
   default is `'ignore'`.

As a shorthand, the `stdio` argument may also be one of the following strings, rather than an array:

* `ignore` - `['ignore', 'ignore', 'ignore']`
* `pipe` - `['pipe', 'pipe', 'pipe']`
* `inherit` - `[process.stdin, process.stdout, process.stderr]` or `[0,1,2]`

For example:

    var spawn = require('child_process').spawn;

    // Child will use parent's stdios
    spawn('prg', [], { stdio: 'inherit' });

    // Spawn child sharing only stderr
    spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

    // Open an extra fd=4, to interact with programs present a
    // startd-style interface.
    spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });

If the `detached` option is set, the child process will be made the leader of a
new process group.  This makes it possible for the child to continue running 
after the parent exits.

By default, the parent will wait for the detached child to exit.  To prevent
the parent from waiting for a given `child`, use the `child.unref()` method,
and the parent's event loop will not include the child in its reference count.

Example of detaching a long-running process and redirecting its output to a
file:

     var fs = require('fs'),
         spawn = require('child_process').spawn,
         out = fs.openSync('./out.log', 'a'),
         err = fs.openSync('./out.log', 'a');

     var child = spawn('prg', [], {
       detached: true,
       stdio: [ 'ignore', out, err ]
     });

     child.unref();

When using the `detached` option to start a long-running process, the process
won't stay running in the background unless it is provided with a `stdio`
configuration that is not connected to the parent.  If the parent's `stdio` is
inherited, the child will remain attached to the controlling terminal.

##### Undocumented Options 

There are several internal options—in particular: `stdinStream`, `stdoutStream`,
and `stderrStream`. They are for INTERNAL USE ONLY. As with all undocumented
APIs in Node.js, they shouldn't be used.

There is also a deprecated option called `customFds`, which allows one to
specify specific file descriptors for the `stdio` of the child process. This API
was not portable to all platforms and therefore removed. With `customFds`, it
was possible to hook up the new process' [stdin, stdout, stderr] to existing
stream; `-1` meant that a new stream should be created. **Use this functionality
at your own risk.**

#### Example: Running `ls -lh /usr`, capturing `stdout`, `stderr`, and the exit
code

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/child_process/child.spawn_1.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

#### Example: A very elaborate way to run `'ps ax | grep ssh'`:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/child_process/child.spawn_2.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

#### Example: Checking for a failed `exec`:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/child_process/child.spawn_3.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### child_process.exec(command[, options], callback(error, stdout, stderr)), Object
- command {String} The Unix command to run
- options {Object} The options to pass to the command
- callback {Function} The function to run after the method completes
- error {Error} The standard `Error` object; `err.code` is the exit code of the child process and `err.signal` is set to the signal that terminated the process
- stdout {stream.ReadableStream} The standard output stream
- stderr {stream.ReadableStream} The standard error stream
(related to: child_process.spawn)

Runs a Unix command in a shell and buffers the output.

There is a second optional argument to specify several options. The default
options are:

    { 
      encoding: 'utf8',
      timeout: 0,
      maxBuffer: 200*1024,
      killSignal: 'SIGTERM',
      cwd: null,
      env: null 
    }

These refer to:

* `cwd`, a [[String string]], specifies the working directory from which the process is spawned
* `stdio`, either an [[Array array]] or [[String string]], containing the child's stdio configuration
* `customFds`, an [[Array array]], is **deprecated**. They were file descriptors for the child to use for stdio
* `env`, an [[Object object]], specifies environment variables that will be visible to the new process
* `detached`, a [[Boolean boolean]], identifying if the child will be a process group leader
* `encoding` is the current encoding the output is defined with
* `timeout` is an integer, which, if greater than `0`, kills the child process
if it runs longer than `timeout` milliseconds
* `maxBuffer` specifies the largest amount of data allowed on stdout or stderr;
if this value is exceeded then the child process is killed.
* `killSignal` defines [a kill
signal](http://kernel.org/doc/man-pages/online/pages/man7/signal.7.html) to kill
the child process with 

For further information on these, see the explanation in [[child_process.exec `child_process.exec()`]].

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/child_process/child.exec.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

* `modulePath` {String} The module to run in the child
* `args` {Array} List of string arguments
* `options` {Object}
  * `cwd` {String} Current working directory of the child process
  * `customFds` {Array} **Deprecated** File descriptors for the child to use
    for stdio.  (See below)
  * `env` {Object} Environment key-value pairs
  * `encoding` {String} (Default: 'utf8')
  * `timeout` {Number} (Default: 0)
  * `uid` {Number} Sets the user identity of the process. (See [setuid(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/setuid.2.html).)
  * `gid` {Number} Sets the group identity of the process. (See [setgid(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/setgid.2.html).)
* `callback` {Function} called with the output when process terminates
  * `code` {Integer} Exit code
  * `stdout` {Buffer}
  * `stderr` {Buffer}
* Return: ChildProcess object

An object containing the three standard streams, plus other parameters like the
PID, signal code, and exit code

### child_process.execFile(file, args, options, callback(error, stdout, stderr))
- file {String} The file location with the commands to run
- args {String} The command line arguments to pass
- options {Object} The options to pass to the `exec` call
- callback {Function} The function to run after the method completes
- error {Error} The standard `Error` object, except `err.code` is the exit code
of the child process, and `err.signal is set to the signal that terminated the
process
- stdout {stream.ReadableStream} is the standard output stream
- stderr {stream.ReadableStream} is the standard error stream

A function similar to `child.exec()`, except instead of executing a subshell it
executes the specified file directly. This makes it slightly leaner than
`child.exec`. It has the same options and callback.

### child_process.fork(modulePath, arguments, options), Object
- modulePath {String} The location of the module
- arguments {Array} A list of string arguments to use
- options {Object} Any additional options to pass
  * `cwd` {String} Current working directory of the child process
  * `customFds` {Array} **Deprecated** File descriptors for the child to use
    for stdio.  (See below)
  * `env` {Object} Environment key-value pairs
  * `encoding` {String} (Default: 'utf8')
(related to: child_process.spawn)

This is a special case of the [[child_process.spawn `child_process.spawn()`]]
functionality for spawning Node.js processes. In addition to having all the
methods in a normal child_process instance, the returned object has a
communication channel built-in. See [[child_process.send `send()`]] for details.

By default the spawned Node.js process will have `stdout` and `stderr`
associated with the parent's. To change this behavior set the `silent` property 
in the `options` object to `true`.

The child process does not automatically exit once it's done; you'll need to 
call [[process.exit `process.exit()`]] explicitly. This limitation may be lifted 
in the future.

These child nodes are still whole new instances of V8. Assume at least 30ms
startup and 10mb memory for each new node. That is, you can't create many
thousands of them.

### child_process.kill([signal='SIGTERM'])
- signal {String} The kill signal to send

Sends a signal to the child process. See
[`signal(7)`](http://www.kernel.org/doc/man-pages/online/pages/man7/signal.7.html) for a list of available signals.

Note that while the function is called `kill`, the signal delivered to the child
process may not actually kill it. `kill` really just sends a signal to a
process.

For more information, see
[`kill(2)`](http://www.kernel.org/doc/man-pages/online/pages/man2/kill.2.html).

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/child_process/child.kill.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### child_process.send(message, [sendHandle])
- message {Object} A parsed JSON object, or a primitive value
- sendHandle {net.Server | net.Socket} A handle object

When using [[child_process.fork `fork()`]], you can write to the child using
this method. Messages are received by a `'message'` event on the child.

For example:

    var cp = require('child_process');

    var n = cp.fork(__dirname + '/sub.js');

    n.on('message', function(m) {
      console.log('PARENT got message:', m);
    });

    n.send({ hello: 'world' });

The child script, `'sub.js'` might look like this:

    process.on('message', function(m) {
      console.log('CHILD got message:', m);
    });

    process.send({ foo: 'bar' });

In the child, the `process` object will have a `send()` method, and `process`
will emit objects each time it receives a message on its channel.

Note: There is a special case when sending a `{cmd: 'NODE_foo'}` message. All messages containing a `NODE_` prefix in its `cmd` property are not be emitted in the `message` event, since they are internal messages used by node core. Messages containing the prefix are emitted in the `internalMessage` event. **You should by all means avoid using this feature, it is subject to change without notice.**

The `sendHandle` option to `child_process.send()` is for sending a TCP server or
socket object to another process. The child receives the object as its
second argument to the `message` event.

#### Examples

Here is an example of sending a server:

    var child = require('child_process').fork('child.js');

    // Open up the server object and send the handle.
    var server = require('net').createServer();
    server.on('connection', function (socket) {
      socket.end('handled by parent');
    });
    server.listen(1337, function() {
      child_process.send('server', server);
    });

And the child would the recive the server object as:

    process.on('message', function(m, server) {
      if (m === 'server') {
        server.on('connection', function (socket) {
          socket.end('handled by child');
        });
      }
    });

Note that the server is now shared between the parent and child. This means
that some connections are handled by the parent and some by the child.


Here is an example of sending a socket. It spawns two children, and handles
connections with the remote address `74.125.127.100` as VIP, by sending the
socket to a "special" child process. Other sockets will go to a "normal" process.

    var normal = require('child_process').fork('child.js', ['normal']);
    var special = require('child_process').fork('child.js', ['special']);

    // Open up the server and send sockets to child
    var server = require('net').createServer();
    server.on('connection', function (socket) {

      // if this is a VIP
      if (socket.remoteAddress === '74.125.127.100') {
        special.send('socket', socket);
        return;
      }
      // just the usual dudes
      normal.send('socket', socket);
    });
    server.listen(1337);

The `child.js` could look like this:

    process.on('message', function(m, socket) {
      if (m === 'socket') {
        socket.end('You were handled as a ' + process.argv[2] + ' person');
      }
    });

Note that once a single socket has been sent to a child, the parent can no
longer keep track of when the socket is destroyed. To indicate this condition,
the `.connections` property becomes `null`. It is also recommended not to use 
`.maxConnections` in this condition.

### child_process.disconnect()

To close the IPC connection between parent and child, use this method. It
allows the child to exit gracefully since there is no IPC channel keeping it alive.
When calling this method, the `disconnect` event is emitted in both parent and child, and the
`connected` flag is set to `false`. Note that you can also call 
[[child_process.disconnect `child_process.disconnect()`]] in the child process.

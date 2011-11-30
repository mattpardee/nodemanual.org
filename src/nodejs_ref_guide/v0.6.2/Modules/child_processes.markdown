## Child Processes

Node.js provides a tri-directional `popen(3)` facility through the `ChildProcess` class.

It is possible to stream data through the child's `stdin`, `stdout`, and `stderr` in a fully non-blocking way.

To create a child process, use `require('child_process').spawn()` in your code.

Child processes always have three streams associated with them. They are:

* `child.stdin`
* `child.stdout`
* `child.stderr`

`ChildProcess` is also an `EventEmitter`.

### Events

@event `'exit'`
@cb `function(code, signal)`: The function to execute once the event fires, `code`: The final exit code of the process (otherwise, `null`), `signal`: The string name of the signal (otherwise, `null`)

This event is emitted after the child process ends.

For more information, see [waitpid(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/wait.2.html).

### Properties

@prop `child.stdin`

A `Writable Stream` that represents the child process's `stdin`. Closing this stream via `end()` often causes the child process to terminate.

@prop `child.stdout`

A `Readable Stream` that represents the child process's `stdout`.

@prop `child.stderr`

A `Readable Stream` that represents the child process's `stderr`.

@prop `child.pid`

The PID of the child process.

#### Example

    var spawn = require('child_process').spawn,
        grep  = spawn('grep', ['ssh']);

    console.log('Spawned child pid: ' + grep.pid);
    grep.stdin.end();


@method `child_process.spawn(command, args=[], [options])`
@param `command`: The command to use, `args`: The command line arguments to pass, `[options]`: Any additional options you want to transfer

Launches a new process with the given `command`, with  command line arguments in `args`.

`optiones` specifies additional options, which default to:

    { cwd: undefined,
      env: process.env,
      setsid: false
    }

They mean:

* `cwd`: specifies the working directory from which the process is spawned
* `env`: specifies environment variables that will be visible to the new process* `setsid`: if `true`, causes the subprocess to be run in a new session

#### Example 

Running `ls -lh /usr`, capturing `stdout`, `stderr`, and the exit code:

    var util  = require('util'),
        spawn = require('child_process').spawn,
        ls    = spawn('ls', ['-lh', '/usr']);

    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
      console.log('child process exited with code ' + code);
    });


A very elaborate way to run `'ps ax | grep ssh'`:

    var util  = require('util'),
        spawn = require('child_process').spawn,
        ps    = spawn('ps', ['ax']),
        grep  = spawn('grep', ['ssh']);

    ps.stdout.on('data', function (data) {
      grep.stdin.write(data);
    });

    ps.stderr.on('data', function (data) {
      console.log('ps stderr: ' + data);
    });

    ps.on('exit', function (code) {
      if (code !== 0) {
        console.log('ps process exited with code ' + code);
      }
      grep.stdin.end();
    });

    grep.stdout.on('data', function (data) {
      console.log(data);
    });

    grep.stderr.on('data', function (data) {
      console.log('grep stderr: ' + data);
    });

    grep.on('exit', function (code) {
      if (code !== 0) {
        console.log('grep process exited with code ' + code);
      }
    });


Checking for failed `exec`:

    var spawn = require('child_process').spawn,
        child = spawn('bad_command');

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
      if (/^execvp\(\)/.test(data)) {
        console.log('Failed to start child process.');
      }
    });

Note that if `spawn `receives an empty options object, it spawns the process with an empty environment rather than using `process.env`. This due to backwards compatibility issues with a deprecated API.

There is also a deprecated option called `customFds` which allows one to specify
specific file descriptors for the stdio of the child process. This API was
not portable to all platforms and therefore removed. With `customFds` it was possible to hook up the new process' [stdin, stdout, stderr] to existing stream ; `-1` meant that a new stream should be created. Use at your own risk.

There are also several internal options. In particular `stdinStream`, `stdoutStream`, `stderrStream`. They are for INTERNAL USE ONLY. As with all undocumented APIs in Node, they shouldn't be used.

For more information, see also [`child_process.exec()`](#child_process.exec).

@method `child_process.exec(command, [options], callback(error, stdout, stderr))`
@param `command`: The command to run, `[options]`: The options to use, `callback(error, stdout, stderr)`: The function to run after the method completes; `error` is the standard `Error` object, except `err.code` is the exit code of the child process, and `err.signal` is set to the signal that terminated the process; `stdout` is the stdout stream and `stderr` is the stderr stream

Runs a command in a shell and buffers the output.

There is a second optional argument to specify several options. The default options are:

    { encoding: 'utf8',
      timeout: 0,
      maxBuffer: 200*1024,
      killSignal: 'SIGTERM',
      cwd: null,
      env: null }

If `timeout` is greater than `0`, then it will kill the child process if it runs longer than `timeout` milliseconds. The child process is killed with `killSignal`. `maxBuffer` specifies the largest amount of data allowed on stdout or stderr; if this value is exceeded then the child process is killed.

#### Example

    var util = require('util'),
        exec = require('child_process').exec,
        child;

    child = exec('cat *.js bad_file | wc -l',
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });

@method `child_process.execFile(file, args, options, `callback(error, stdout, stderr))`
@param: `file`: The file with the commands to run, `args`: The command line arguments to pass, `[options]`: Any additional options you want to transfer, `callback(error, stdout, stderr)`: The function to run after the method completes; `error` is the standard `Error` object, except `err.code` is the exit code of the child process, and `err.signal` is set to the signal that terminated the process; `stdout` is the stdout stream and `stderr` is the stderr stream

This is similar to `child_process.exec()` except it does not execute a
subshell but rather the specified file directly. This makes it slightly
leaner than `child_process.exec`. It has the same options and callback.

@method `child_process.fork(modulePath, arguments, options)`
@param `modulePath`: The location of the module, `arguments`: Any starting arguments to use, `options`: Any additional options to pass

This is a special case of the `spawn()` functionality for spawning Node.js processes. In addition to having all the methods in a normal ChildProcess instance, the returned object has a communication channel built-in. The channel is written with `child.send(message, [sendHandle])`, and messages are recieved by a `'message'` event on the child.

By default the spawned Node.js process will have the stdin, stdout, stderr associated with the parent's.

These child Nodes are still whole new instances of V8. Assume at least 30ms startup and 10mb memory for each new Node. That is, you cannot create many thousands of them.

#### Example

    var cp = require('child_process');

    var n = cp.fork(__dirname + '/sub.js');

    n.on('message', function(m) {
      console.log('PARENT got message:', m);
    });

    n.send({ hello: 'world' });

The child script, `'sub.js'`, might look like this:

    process.on('message', function(m) {
      console.log('CHILD got message:', m);
    });

    process.send({ foo: 'bar' });

In the child the `process` object will have a `send()` method, and `process`  emits objects each time it receives a message on its channel.


The `sendHandle` option to `child.send()` is for sending a handle object to another process. The child receives the handle as as second argument to the `message` event. Here is an example of sending a handle:

    var server = require('net').createServer();
    var child = require('child_process').fork(__dirname + '/child.js');
    // Open up the server object and send the handle.
    server.listen(1337, function() {
      child.send({ server: true }, server._handle);
    });

Here's an example of receiving the server handle and sharing it between processes:

    process.on('message', function(m, serverHandle) {
      if (serverHandle) {
        var server = require('net').createServer();
        server.listen(serverHandle);
      }
    });


@method `child.kill(signal='SIGTERM')`
@param `signal`: The kill signal to send

Send a signal to the child process. See [`signal(7)`](http://www.kernel.org/doc/man-pages/online/pages/man7/signal.7.html) for a list of available signals.

Note that while the function is called `kill`, the signal delivered to the child process may not actually kill it.  `kill` really just sends a signal to a process.

For more information, see [`kill(2)`](http://www.kernel.org/doc/man-pages/online/pages/man2/kill.2.html).

#### Example

    var spawn = require('child_process').spawn,
        grep  = spawn('grep', ['ssh']);

    grep.on('exit', function (code, signal) {
      console.log('child process terminated due to receipt of signal '+signal);
    });

    // send SIGHUP to process
    grep.kill('SIGHUP');
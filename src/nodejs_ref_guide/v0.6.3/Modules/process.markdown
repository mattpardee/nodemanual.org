## process

The `process` object is a global object, and can be accessed from anywhere. It is an instance of `EventEmitter`.

### Events

@event `exit`
@cb `function()`: The callback to execute once the event fires

Emitted when the process is about to exit.  This is a good hook to perform constant time checks of the module's state (like for unit tests).  The main event loop will no longer be run after the `exit` callback finishes, so timers may not be scheduled.

#### Example

Here's an example of listening for `exit`:

    process.on('exit', function () {
        process.nextTick(function () {
            console.log('This will not run');
        });
        console.log('About to exit.');
    });

@event `uncaughtException`
@cb `function(err)`: The callback to execute once the event fires, `err` : The standard Error Object

Emitted when an exception bubbles all the way back to the event loop. If a listener is added for this exception, the default action (which is to print a stack trace and exit) will not occur.

#### Example

Here's an example of listening for `uncaughtException`:

    process.on('uncaughtException', function (err) {
      console.log('Caught exception: ' + err);
    });

    setTimeout(function () {
      console.log('This will still run.');
    }, 500);

    // Intentionally cause an exception, but don't catch it.
    nonexistentFunc();
    console.log('This will not run.');

**Note**: an `uncaughtException` is a very crude mechanism for exception handling.  Using try / catch in your program will give you more control over your program's flow.  Especially for server programs that are designed to stay running forever, `uncaughtException` can be a useful safety mechanism.

#### Handling Signal Events

Signal events are emitted when processes receive a signal. See [sigaction(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/sigaction.2.html) for a list of standard POSIX signal names such as SIGINT, SIGUSR1, etc.

#### Example

Here's an example of listening for `SIGINT`:

    // Start reading from stdin so we don't exit.
    process.stdin.resume();

    process.on('SIGINT', function () {
      console.log('Got SIGINT.  Press Control-D to exit.');
    });

An easy way to send the `SIGINT` signal is with `Control-C` in most terminal
programs.

### Methods

@method `process.chdir(directory)`
@param `directory`: The directory name to change to

Changes the current working directory of the process or throws an exception if that fails.

#### Example

    console.log('Starting directory: ' + process.cwd());
    try {
      process.chdir('/tmp');
      console.log('New directory: ' + process.cwd());
    }
    catch (err) {
      console.log('chdir: ' + err);
    }

@method `process.cwd()`

Returns the current working directory of the process.

    console.log('Current directory: ' + process.cwd());

@method `process.exit(code=0)`
@param `code`: The code to end with; the default is `0`.

Ends the process with the specified `code`.

#### Example

To exit with a 'failure' code:

    process.exit(1);

The shell that executed this should see the exit code as `1`.


@method `process.getgid()`

Gets the group identity of the process. For more information, see [getgid(2)](http://kernel.org/doc/man-pages/online/pages/man2/getgid.2.html).
This is the numerical group id, not the group name.

#### Example

    console.log('Current gid: ' + process.getgid());

@method `process.getuid()`

Gets the user identity of the process. Note that this is the numerical userid, not the username. For more information, see [getuid(2)](http://kernel.org/doc/man-pages/online/pages/man2/getuid.2.html).

#### Example

    console.log('Current uid: ' + process.getuid());

@method `process.kill(pid, signal='SIGTERM')`
@param `pid`: The process id to kill, `signal`: A string describing the signal to send; the default is `SIGTERM`.

Send a signal to a process. The `signal` names are strings like
'SIGINT' or 'SIGUSR1'. For more information, see [kill(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/kill.2.html).

**Note**: that just because the name of this function is `process.kill`, it is
really just a signal sender, like the `kill` system call.  The signal sent
may do something other than kill the target process.

#### Example

Here's an example of sending a signal to yourself:

    process.on('SIGHUP', function () {
      console.log('Got SIGHUP signal.');
    });

    setTimeout(function () {
      console.log('Exiting.');
      process.exit(0);
    }, 100);

    process.kill(process.pid, 'SIGHUP');


@method `process.memoryUsage()`

Returns an object describing the memory usage of the Node.js process
measured in bytes.

#### Example

    var util = require('util');

    console.log(util.inspect(process.memoryUsage()));

This generates:

    { rss: 4935680,
      heapTotal: 1826816,
      heapUsed: 650472 }

`heapTotal` and `heapUsed` refer to V8's memory usage.

@method `process.nextTick(callback())`
@param  `callback`: The callback function to execute on the next tick

On the next loop around the event loop call this callback.
This is **not** a simple alias to `setTimeout(fn, 0)`; it's much more
efficient.

#### Example

    process.nextTick(function () {
      console.log('nextTick callback');
    });

@method `process.setgid(id)`
@param `id`: The new identity for the group process

Sets the group identity of the process. This accepts either a numerical ID or a groupname string. If a groupname is specified, this method blocks while resolving it to a numerical ID. For more information, see [setgid(2)](http://kernel.org/doc/man-pages/online/pages/man2/setgid.2.html).

#### Example

    console.log('Current gid: ' + process.getgid());
    try {
      process.setgid(501);
      console.log('New gid: ' + process.getgid());
    }
    catch (err) {
      console.log('Failed to set gid: ' + err);
    }
    
@method `process.setuid(id)`
@param `id`: The new identity for the user process

Sets the user identity of the process. This accepts either
a numerical ID or a username string.  If a username is specified, this method
blocks while resolving it to a numerical ID. For more information, see [setuid(2)](http://kernel.org/doc/man-pages/online/pages/man2/setuid.2.html).

#### Example

    console.log('Current uid: ' + process.getuid());
    try {
      process.setuid(501);
      console.log('New uid: ' + process.getuid());
    }
    catch (err) {
      console.log('Failed to set uid: ' + err);
    }
    
@method `process.umask([mask])`
@param The mode creation mask to get or set

Sets or reads the process's file mode creation mask. Child processes inherit
the mask from the parent process. Returns the old mask if `mask` argument is
given, otherwise returns the current mask.

#### Example

    var oldmask, newmask = 0644;

    oldmask = process.umask(newmask);
    console.log('Changed umask from: ' + oldmask.toString(8) +
                ' to ' + newmask.toString(8));

@method `process.uptime()`

Returns the number of seconds Node.js has been running.

### Properties

@prop `process.arch`

Identifies which processor architecture you're running on: `'arm'`, `'ia32'`, or `'x64'`.

#### Example

    console.log('This processor architecture is ' + process.arch);

@prop `process.argv`

An array containing the command line arguments.  The first element will be
'node', the second element will be the name of the Javascript file.  The
next elements will be any additional command line arguments.

#### Example

    // print process.argv
    process.argv.forEach(function (val, index, array) {
      console.log(index + ': ' + val);
    });

This generates:

    $ node process-2.js one two=three four
    0: node
    1: /Users/mjr/work/node/process-2.js
    2: one
    3: two=three
    4: four
 
@prop `process.execPath`

This is the absolute pathname of the executable that started the process.

#### Example

    console.log(process.execPath) 
    // returns /usr/local/bin/node
    
@prop `process.pid`

Returns the PID of the process.

#### Example

    console.log('This process is pid ' + process.pid);

@prop `process.platform`

#### Example

Identifies the platform you're running on, like `'linux2'`, `'darwin'`, etc.

#### Example

    console.log('This platform is ' + process.platform);

@prop `process.title`

A getter/setter to set what is displayed in `ps`.

@prop `process.version`

A compiled-in property that exposes the `NODE_VERSION`.

#### Example

    console.log('Version: ' + process.version);

@prop `process.versions`

A property exposing version strings of Node.js and its dependencies.

#### Example

    console.log(process.versions);

Will output:

    { node: '0.4.12',
      v8: '3.1.8.26',
      ares: '1.7.4',
      ev: '4.4',
      openssl: '1.0.0e-fips' }


@prop `process.installPrefix`

A compiled-in property that exposes `NODE_PREFIX`.

#### Example

    console.log('Prefix: ' + process.installPrefix);
    
### Objects

@obj `process.stderr`

A writable stream to stderr.

`process.stderr` and `process.stdout` are unlike other streams in Node in
that writes to them are usually blocking.  They are blocking in the case
that they refer to regular files or TTY file descriptors. In the case they
refer to pipes, they are non-blocking like other streams.

@obj `process.env`

An object containing the user environment. See [environ(7)](http://kernel.org/doc/man-pages/online/pages/man7/environ.7.html).

@obj `process.stdin`

A `Readable Stream` for stdin. The stdin stream is paused by default, so one
must call `process.stdin.resume()` to read from it.

#### Example

Here's an example of opening standard input and listening for both events:

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (chunk) {
      process.stdout.write('data: ' + chunk);
    });

    process.stdin.on('end', function () {
      process.stdout.write('end');
    });


@obj `process.stdout`

A writable stream to `stdout`.

#### Example

Here's what the innards of `console.log()` look like:

    console.log = function (d) {
      process.stdout.write(d + '\n');
    };

`process.stderr` and `process.stdout` are unlike other streams in Node.js in that writes to them are usually blocking.  They are blocking in the case that they refer to regular files or TTY file descriptors. In the case they refer to pipes, they are non-blocking like other streams.
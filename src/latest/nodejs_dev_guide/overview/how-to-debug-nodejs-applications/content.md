## Debugging Node.js Applications

Often times, not just in the Node.js community but in software at large, people debug simply with a liberal sprinkle of standard output statements. This allows you to track down where unexpected values are being generated. However, this method can be tedious, or worse, not robust enough to detect real problems.

Thankfully, through the use of the `node-inspector` module, we can harness the power of webkit-debuggers to work with our Node.js code. The process itself is simple.

#### Setting up

First, ensure that node-inspector is installed:

    npm -g install node-inspector

Here's a good example application to experiment with, copied from the `node-inspector` repo. It is a "hello world" server with a counter :

    var http = require('http');
    var x = 0;

    http.createServer(function (req, res) {
        x += 1;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World ' + x);
    }).listen(8124);

    console.log('Server running at http://127.0.0.1:8124/');

First, start the Node.js program with debugging enabled:

    node --debug app.js

This should print something along the lines of `debugger listening on port 5858` to stderr. Take note of the port number: it is the port that the debugger is running on.

Next, start up `node-inspector` in a separate command line window. By default, `node-inspector` uses port 8080, so you may want to pass it a custom port number with the `--web-port` option: If your program uses port 8080, then you may have to pass it a custom port.

    node-inspector --web-port=1123

Finally, start a Webkit browser (like Chrome or Safari), and go to `http://127.0.0.1:1123/debug?port=5858`. Here, 5858 represents the port the debugger is listening on, and 1123 represents your `node-inspector` webport. You may have to modify these values to match your environment.

At this point, you will be met with a fairly empty screen with the Scripts, Profiles, and Cnsole tabs.

#### Scripts tab

This tab is just like most Webkit debuggers. It has a list of all the Javascript files (including Node.js core and third-party libraries). You can select each one and dive into them.

To stop the interpreter on a specific line, set a breakpoint by clicking on the number of the desired line. When the execution is frozen, by a breakpoint or by manually pausing interpretation by pressing the pause button, you can check the callstack and examine all the local, closure, and global variables. You can also modify the code to try and fix the behavior. Note that when you modify the code through the Script tab, it does not get saved to the file, so you will need to transfer the modifications back by hand.

#### Profiles tab

To use the profile tab, you need a library called `v8-profiler`, which you can install with npm:

    npm install v8-profiler

Next, you have to require it inside the file you are debugging:

    var profiler = require('v8-profiler');

Now you can finally enable the `Profiles` tab. Unfortunately, all you can do from this screen is take a heap snapshot. From the code, you need to select where you want to start to CPU profiler. You can also select more precise location for heap snapshots.

To take a heap snapshot, just insert this line in the desired location and optionally pass it a name.

  var snapshot = profiler.takeSnapshot(name);

To take a CPU profile, just surround the code that you are profiling with the two lines shown below.  Optionally, a name can be included to indentify the cpu profile.

    profiler.startProfiling(name);
    //..lots and lots of methods and code called..//
    var cpuProfile = profiler.stopProfiling([name]);

As an example how to use these, here is the code from above, modified to take a CPU profile on every request, and take a heap snapshot after the server is created.

    var http = require('http');
    var profiler = require('v8-profiler');

    var x = 0;
    http.createServer(function (req, res) {
        x += 1;
        profiler.startProfiling('request '+x);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World ' + x);
        profiler.stopProfiling('request '+x);
    }).listen(8124);
  
    profiler.takeSnapshot('Post-Server Snapshot');
    console.log('Server running at http://127.0.0.1:8124/');

Despite these APIs returning objects, it is much easier to sort through the data through the `node-inspector` interface. Hopefully, with these tools, you can make more informed decisions about memory leaks and bottlenecks.

#### Console tab

The console tab allows you to use Node's REPL in your program's global scope. This has a few caveats, since it means you can't access in local variables. Thus, the variables you _can_ read or write are variables that were defined without a `var` statement. 

The other exception is that when you use `console.log`, it refers to Node's `console.log`, and not webkit's `console.log`. This means the output goes to stdout and not to your console tab. 

Other than these, it is a very straightforward Node.js REPL.
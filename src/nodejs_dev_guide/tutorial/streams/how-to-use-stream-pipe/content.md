### Using the Stream Pipe

If you've been using Node.js for a while, you've definitely run into streams. HTTP connections are streams,  open files are streams;  `stdin`, `stdout`, and `stderr` are all streams as well.  If you feel like you still need to understand them better, you can read more about them [here](http://nodejs.org/docs/latest/api/streams.html).

Streams make for quite a handy abstraction, and there's a lot you can do with them. As an example, let's take a look at `pipe()`, the method used to take a readable stream and connect it to a writeable steam.  Suppose we wanted to spawn a child process and pipe our "parent" `stdout` and `stdin` to the corresponding `stdout` and `stdin`. We might do something like this:

     #!/usr/bin/env node

     var child = require('child_process');

     // spawn the node REPL as a child process
     var myREPL = child.spawn('node');

     // pipe our stdin and stdout into the child stdin/stdout
     myREPL.stdout.pipe(process.stdout, { end: false });
     process.stdin.resume();
     process.stdin.pipe(myREPL.stdin, { end: false });

     myREPL.stdin.on('end', function() {
       process.stdout.write('REPL stream ended.');
     });

     myREPL.on('exit', function (code) {
       process.exit(code);
     });

There it is. Make sure to listen for the child's `exit` event, or else your program will just hang there when the REPL exits.

Another use for `pipe()` is for file streams.  In Node.js, `fs.createReadStream()` and `fs.createWriteStream()` are used to create a stream to an open file descriptor.  Let's look at how one might use `pipe()` to write to a file.  You'll probably recognize most of the code:

     #!/usr/bin/env node

     var child = require('child_process'),
         fs = require('fs');

     var myREPL = child.spawn('node'),
         myFile = fs.createWriteStream('myOutput.txt');

     myREPL.stdout.pipe(process.stdout, { end: false });
     myREPL.stdout.pipe(myFile);

     process.stdin.resume();

     process.stdin.pipe(myREPL.stdin, { end: false });
     process.stdin.pipe(myFile);

     myREPL.stdin.on("end", function() {
       process.stdout.write("REPL stream ended.");
     });

     myREPL.on('exit', function (code) {
       process.exit(code);
     });

With those small additions, your `stdin` and the `stdout` from your REPL will both be piped to the writeable file stream you opened to `myOutput.txt`.  It's that simple; you can pipe streams to as many places as you want.

One very important use case for `pipe()` is with HTTP request and response objects.  Here we have the very simplest kind of proxy:

     #!/usr/bin/env node

     var http = require('http');

     http.createServer(function(request, response) {
       var proxy = http.createClient(9000, 'localhost')
       var proxyRequest = proxy.request(request.method, request.url, request.headers);
       proxyRequest.on('response', function (proxyResponse) {
         proxyResponse.pipe(response);
       });
       request.pipe(proxyRequest);
     }).listen(8080);

     http.createServer(function (req, res) {
       res.writeHead(200, { 'Content-Type': 'text/plain' });
       res.write('request successfully proxied to port 9000!' + '\n' + JSON.stringify(req.headers, true, 2));
       res.end();
     }).listen(9000);

You could also use `pipe()` to send incoming requests to a file for logging, or to a child process, or any one of a number of other things.
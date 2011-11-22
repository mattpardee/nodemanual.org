

&ltdiv class="hero-unit">

<a class="hiddenLink" id="understanding-streams"></a>

### Understanding Streams



Streams are another basic construct in Node.js that encourages asynchronous coding. A 'stream' is Node's I/O abstraction. Streams allow you to process the data as it is generated or retrieved. Streams can be readable, writeable, or both.

Basically, streams use events to deal with data as it happens, rather than only with a callback at the end.  Readable streams emit the event `data` for each chunk of data that comes in, and an `end` event, which is emitted when there is no more data. Writeable streams can be written to with the `write()` function, and closed with the `end()` function.  All types of streams emit `error` events when errors arise.

As a quick example, we can write a simple version of `cp` (the Unix utility that copies files). We could do this by reading the whole file with standard filesystem calls and then writing it out to a file. Unfortunately, that requires that the whole file be read in before it can be written. In the case of a one or two gigabyte file, you could run into out of memory operations failry quickly. 

The biggest advantage that streams give you over their non-stream versions is that you can start to process the data before you have all the information. Writing out the file doesn't speed up, but if we were streaming over the internet or doing CPU processing on it then there could be measurable performance improvements.

Create a new file called `cp.js`, and copy-paste the following code:

    var fs = require('fs');
    console.log(process.argv[2], '->', process.argv[3]);

    var readStream = fs.createReadStream(process.argv[2]);
    var writeStream = fs.createWriteStream(process.argv[3]);

    readStream.on('data', function (chunk) {
      writeStream.write(chunk);
    });

    readStream.on('end', function () {
      writeStream.end();
    });

    //Some basic error handling
    readStream.on('error', function (err) {
      console.log("ERROR", err);
    });

    writeStream.on('error', function (err) {
      console.log("ERROR", err);
    });

Run this script with arguments like `node cp.js src.txt dest.txt`. This would mean, in the code above, that `process.argv[2]` is `src.txt` and `process.argv[3]` is `desc.txt`. Obviously, you'll need some dummy text files before you can run the script.

The code sets up a readable stream from the source file and a writable stream to the destination file. Whenever the readable stream gets data, it is written to the writeable stream. After it's done, it closes the writable stream when the readable stream is finished. **Note**: it would have been better to use [pipe](#how-to-use-stream-pipe) like `readStream.pipe(writeStream);`. However, to show how streams work, we have done things the long way.&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="streams"></a>

## Streams
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>

&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="using-fscreatereadstream"></a>

### Using fs.createReadStream()
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


The function `fs.createReadStream(filepath)` allows you to open up a readable stream in a very simple manner. All you have to do is pass the path of the file to start streaming in. 

Again, since the response and request objects are streams, we can create an HTTP server that streams the files to the client. Since the code is simple enough, it is pretty easy just to read through it and comment why each line is necessary.

    var http = require('http');
    var fs = require('fs');

    http.createServer(function(req, res) {
      // The filename is simple the local directory and tacks on the requested url
      var filename = __dirname+req.url;

      // This line opens the file as a readable stream
      var readStream = fs.createReadStream(filename);

      // This will wait until we know the readable stream is actually valid before piping
      readStream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        readStream.pipe(res);
      });

      // This catches any errors that happen while creating the readable stream (usually invalid names)
      readStream.on('error', function(err) {
        res.end(err);
      });
    }).listen(8080);&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="using-fscreatewritestream"></a>

### Using fs.createWriteStream()
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


The function `fs.createWriteStream()` creates a writable stream in a very simple manner. After a call to `fs.createWriteStream(filepath)`, you have a writeable stream to work with directly to your `filepath`. 

When you [create an HTTP server](#how-to-create-a-http-server), the response and request objects are streams. We can stream the POST data to a file called `output`. Since the code is simple enough, it is pretty easy just to read through it and comment why each line is necessary.

    var http = require('http');
    var fs = require('fs');

    http.createServer(function(req, res) {
      // This opens up the writeable stream to `output`
      var writeStream = fs.createWriteStream('./output');

      // This pipes the POST data to the file
      req.pipe(writeStream);

      // After all the data is saved, respond with a simple html form so they can post more data
      req.on('end', function () {
        res.writeHead(200, {"content-type":"text/html"});
        res.end('<form method="POST"><input name="test" /><input type="submit"></form>');
      });

      // This is here incase any errors occur
      writeStream.on('error', function (err) {
        console.log(err);
      });
    }).listen(8080);&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="using-the-stream-pipe"></a>

### Using the Stream Pipe
<span class="cite">by Charlie McConnell (Last Updated: Aug 26 2011)</span>


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

You could also use `pipe()` to send incoming requests to a file for logging, or to a child process, or any one of a number of other things.&lt/div>

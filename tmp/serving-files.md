

&ltdiv class="hero-unit">

<a class="hiddenLink" id="creating-an-http-server"></a>

### Creating an HTTP Server



Making a simple HTTP server in Node.js has become the de-facto 'hello world' for the platform. Node.js provides extremely easy-to-use HTTP APIs; in addition, a simple web server also serves as an excellent demonstration of Node's asynchronous strengths.

Let's take a look at a very simple example:

    var http = require('http');
    var requestListener = function (req, res) {
        res.writeHead(200);
        res.end('Hello, World!\n');
    }

    var server = http.createServer(requestListener);
    server.listen(8080);

Save this in a file called `server.js`, ande from the command line, run `node server.js`. Your program will hang there: it's waiting for connections to respond to, and you'll have to give it one if you want to see it do anything. Open up a browser, and type `localhost:8080` into the location bar. If everything has been set up correctly, you should see your server saying hello!

Let's take a more in-depth look at what the above code is doing.  First, a function is defined called `requestListener` that takes a `request` object  (`req`) and a `response` object (`res`) as parameters. 

The `request` object contains things such as the requested URL, but in this example we ignore it and always return "Hello World!". 

The `response` object is how we send the headers and contents of the response back to the user making the request. Here, we return a 200 response code (signaling a successful response) with the body "Hello World!".  Other headers, such as `Content-type`, would also be set here.

Next, the `http.createServer()` method creates a server that calls `requestListener` whenever a request comes in. The next line, `server.listen(8080)`, calls the `listen` method, which causes the server to wait for incoming requests on the specified port&mdash;8080, in this case. &lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="reading-files"></a>

### Reading Files
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


Reading the contents of a file into memory is a very common programming task, and, as with many other things, the Node.js core API provides methods to make this trivial.  There are a variety of file system methods, all contained in the `fs` module.  The easiest way to read the entire contents of a file is with `fs.readFile()`, as follows:

    fs = require('fs');
    fs.readFile(file, [encoding], [callback]);

Here's what the parameters do:

* `file` is a string filepath of the file to read
* `encoding` is an optional parameter that specifies the type of encoding to read the file. Possible encodings are 'ascii', 'utf8', and 'base64'. If no encoding is provided, the default is `utf8`.
* `callback` is an optional function to call when the file has been read and the contents are ready. It is passed two arguments: `error` and `data`.  If there is no error, `error` will be `null` and `data` will contain the file contents; otherwise `err` contains the error message.

If we wanted to read `/etc/hosts` and print it to stdout (just like UNIX `cat`), we might try doing this:

    fs = require('fs')
    fs.readFile('/etc/hosts', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    });

The contents of `/etc/hosts` should now be visible to you, provided you have permission to read the file in the first place.

Let's now take a look at an example of what happens when you try to read an invalid fil&mdash;the easiest example is one that doesn't exist.

    fs = require('fs');
    fs.readFile('/doesnt/exist', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    });

This is the output:

    { stack: [Getter/Setter],
      arguments: undefined,
      type: undefined,
      message: 'ENOENT, No such file or directory \'/doesnt/exist\'',
      errno: 2,
      code: 'ENOENT',
      path: '/doesnt/exist' }

This is a basic Node.js [Error object](#what-is-the-error-object). It can often be useful to log `err.stack` directly, since this contains a stack trace to the location in code at which the Error object was created.&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="writing-files-in-nodejs"></a>

### Writing files in Node.js
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


Writing to a file is another of the basic programming tasks that one usually needs to know about. This task is very simple in Node.js.  We can use the handy `writeFile()` method inside the standard library's `fs` module, which can save all sorts of time and trouble.

    fs = require('fs');
    fs.writeFile(filename, data, [encoding], [callback])

Here's what the parameters mean:

* `file` is a string filepath of the file to read

* `data` is a string or buffer of the data you want to write to the file

* `encoding` is an optional string defining the encoding of the `data`. Possible encodings are 'ascii', 'utf8', and 'base64'. If no encoding provided, then the default is 'utf8'
*
* `callback` is an optional function that receives an error message, like so: `function (err) {}`. If there is no error, `err === null`; otherwise `err` contains the error message.

For example, if we wanted to write "Hello World" to `helloworld.txt`:

    fs = require('fs');
    fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
      if (err) return console.log(err);
      console.log('Hello World > helloworld.txt');
    });

    [contents of helloworld.txt]:
    Hello World!

If we purposely want to cause an error, we can try to write to a file that we don't have permission to access:

    fs = require('fs')
    fs.writeFile('/etc/doesntexist', 'abc', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    });

The console then prints:

    { stack: [Getter/Setter],
      arguments: undefined,
      type: undefined,
      message: 'EACCES, Permission denied \'/etc/doesntexist\'',
      errno: 13,
      code: 'EACCES',
      path: '/etc/doesntexist' }&lt/div>

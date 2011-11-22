

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

<a class="hiddenLink" id="serving-files"></a>

## Serving Files
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>

&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="creating-an-https-server"></a>

### Creating an HTTPS Server
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


To create an HTTPS server, you need two things: an SSL certificate, and Node's built-in `https` module.

We need to start out with a word about SSL certificates.  Speaking generally, there are two kinds of certificates: those signed by a 'Certificate Authority', or CA, and a 'self-signed certificates'.  A Certificate Authority is a trusted source for an SSL certificate, and using a certificate from a CA allows your users to be trust the identity of your website. In most cases, you would want to use a CA-signed certificate in a production environment; for testing purposes, however, a self-signed certicate will do just fine.

To generate a self-signed certificate, run the following in your shell:

	openssl genrsa -out key.pem
	openssl req -new -key key.pem -out csr.pem
	openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
	rm csr.pem

This should leave you with two files, `cert.pem` (the certificate) and `key.pem` (the private key). This is all you need for a SSL connection. 

Next, set up a quick "hello world" example. ():

    var https = require('https');
    var fs = require('fs');

    // read the certificate
    var options = {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    };

    var a = https.createServer(options, function (req, res) {
      res.writeHead(200);
      res.end("hello world\n");
    }).listen(8000);

The biggest difference between [HTTP](#how-do-i-create-a-http-server) and HTTPS is the additional `options` parameter

**Note**: `fs.readFileSync()`&mdash;unlike `fs.readFile()`&mdash;blocks the entire process until it completes.  In situations like this&mdash;loading vital configuration data&mdash;the `Sync` functions are okay.  In a busy server, however, using a synchronous function during a request will force the server to deal with the requests one by one!

Now that your server is set up and started, you should be able to get the file with curl:

    curl -k https://localhost:8000

or in your browser, by going to `https://localhost:8000`. &lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="serving-static-files"></a>

### Serving Static Files
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


A basic necessity for most [HTTP servers](#how-do-i-create-a-https-server) is tbeing able to serve static files. This is not that hard to do in Node.js. First you read the file, and then you serve the file.  Here is an example of a script that will serve the files in the current directory:

    var fs = require('fs'),
    http = require('http');

    http.createServer(function (req, res) {
      fs.readFile(__dirname + req.url, function (err,data) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    }).listen(8080);

This example takes the path requested and it serves that path, relative to the local directory. This works fine as a quick solution; however, there are a few problems with this approach. First, this code does not correctly handle MIME types. Additionally, a proper static file server should really be taking advantage of client side caching, and should send a "Not Modified" response if nothing has changed.  Furthermore, there are security bugs that can enable a malicious user to break out of the current directory, (for example, by issuing `GET /../../../`). 

Each of these can be addressed invidually without much difficulty. You can send the proper MIME type header. You can figure how to utilize the client caches. You can take advantage of `path.normalize` to make sure that requests don't break out of the current directory. But why write all that code when you can just use someone else's library? 

There is a good static file server called [node-static](https://github.com/cloudhead/node-static) written by Alexis Sellier which you can leverage. Here is a script which functions similarly to the previous one:

    var static = require('node-static');
    var http = require('http');

    var file = new(static.Server)();

    http.createServer(function (req, res) {
      file.serve(req, res);
    }).listen(8080);

This is a fully functional file server that doesn't have any of the bugs previously mentioned. This is just the most basic set up. There are more things you can do if you investigate [the API](https://github.com/cloudhead/node-static). Since it's an open source project, you can always modify it to your needs (and contribute back to the project).&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="reading-post-data"></a>

### Reading POST Data
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


Reading the data from a POST request (i.e. a form submission) can be a little bit of a pitfall in Node.js, so we're going to go through an example of how to do it properly.  

The first step is to listen for incoming data. The trick is to wait for the data to finish, so that you can process all the form data without losing anything. 

Here is a quick script that shows you how to do exactly that:

    var http = require('http');
    var postHTML = "<html><head><title>Post Example</title></head><body>" +
    '<form method="post">' +
      'Input 1: <input name="input1"><br>' +
        'Input 2: <input name="input2"><br>' +
        '<input type="submit">' +
        '</form>' +
        '</body></html>';

    http.createServer(function (req, res) {
      var body = "";
      req.on('data', function (chunk) {
        body += chunk;
      });
      req.on('end', function () {
        console.log('POSTed: ' + body);
        res.writeHead(200);
        res.end(postHTML);
      });
    }).listen(8080);

The variable `postHTML` is a static string containing the HTML for two input boxes and a submit box . This HTML is provided so that you can `POST` example data. This is **not** the right way to serve static HTML; to do that, see [How to Serve Static Files](#how-to-serve-static-files) for a more proper example.

With the HTML out of the way, we [create a server](#how-do-i-create-a-http-server) to listen for requests. It is important to note, when listening for POST data, that the `req` object is also an [Event Emitter](#what-are-event-emitters).  `req`, therefore, will emit a `data` event whenever a chunk of incoming data is received; when there is no more incoming data, the `end` event is emitted. In our case, we listen for `data` events. Once all the data is recieved, we log the data to the console and send the response. 

Something important to note is that the event listeners are being added immediately after the request object is received. If you don't immediately set them, then there is a possibility of missing some of the events. If, for example, an event listener was attached from inside a callback, then the `data` and `end` events might be fired in the meantime with no listeners attached!

You can save this script to `server.js` and run it with `node server.js`. Once you run it you will notice that occassionally you will see lines with no data:  `POSTed: `. This happens because regular `GET` requests go through the same codepath. In a more real-world application, it would be proper practice to check the type of request and handle the different request types differently.&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="handling-multipart-form-data"></a>

### Handling Multi-Part Form Data
<span class="cite">by AvianFlu (Last Updated: Sep 09 2011)</span>


Handling form data and file uploads properly is an important and complex problem in HTTP servers.  Doing it by hand would involve parsing streaming binary data, writing it to the file system, parsing out additional form data, and several other complex concerns. Luckily, only a very few people will need to worry about it on that deep level. 

Felix Geisendorfer, one of the Node.js core committers, wrote a library called `node-formidable` that handles all the hard parts for you. With its friendly API, you can be parsing forms and receiving file uploads in no time.

This example is taken directly from the `node-formidable` GitHub page, with some additional explanation added.

    var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

    http.createServer(function(req, res) {
      
      // This if statement is here to catch form submissions, 
      // and initiate multipart form data parsing.     
      if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
      
        // Instantiate a new formidable form for processing.
        var form = new formidable.IncomingForm();
        
        // form.parse() analyzes the incoming stream data, 
        // picking apart the different fields and files for you.
        form.parse(req, function(err, fields, files) {
          if (err) {
            // Check for and handle any errors here.
            console.error(err.message);
            return;
          }

          res.writeHead(200, {'content-type': 'text/plain'});
          res.write('received upload:\n\n');
                    
          // This last line responds to the form submission 
          // with a list of the parsed data and files.
          res.end(util.inspect({fields: fields, files: files}));
        });

        return;
      }

      // If this is a regular request, and not a form submission, then send the form
      res.writeHead(200, {'content-type': 'text/html'});
      res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
      );
    }).listen(8080);

Using `node-formidable` is definitely the simplest solution, and it is a battle-hardened, production-ready library. Let userland solve problems like this for you, so that you can get back to writing the rest of your code!&lt/div>

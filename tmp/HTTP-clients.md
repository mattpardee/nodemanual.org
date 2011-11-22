

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

<a class="hiddenLink" id="accessing-query-string-parameters"></a>

### Accessing Query String Parameters
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


In Node.js, functionality to aid in the accessing of URL query string parameters is built into the standard library. The `url.parse()` method takes care of most of the heavy lifting.  Here is an example script using this handy function and an explanation on how it works:

    var fs = require('fs');
    var http = require('http');
    var url = require('url') ;

    http.createServer(function (req, res) {
      var queryObject = url.parse(req.url,true).query;
      console.log(queryObject);

      res.writeHead(200);
      res.end('Feel free to add query parameters to the end of the url');
    }).listen(8080);

The key part of this whole script is this line:

	var queryObject = url.parse(req.url,true).query;`

Let's take a look at things from the inside-out.  First off, `req.url` looks something like `/app.js?foo=bad&baz=foo`. This is the part that is in the URL bar of the browser. Next, it gets passed to `url.parse()` which parses out the various elements of the URL. The second parameter of the function is a boolean stating whether the method should parse the query string, so we set it to `true`. Finally, we access the `.query` property, which returns us a nice, friendly JSON with our query string data. &lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="creating-http-get-and-post-requests"></a>

### Creating HTTP GET and POST Requests
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


Another extremely common programming task is making an HTTP request to a web server.  Node.js provides an extremely simple API for this functionality in the form of `http.request`.

As an example, we are going to preform a GET request to [www.random.org](www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new) (which returns a random integer between 1 and 10) and print the result to the console:

    var http = require('http');

    //The url we want
    var options = {
      host: 'www.random.org',
      path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    };

    callback = function(response) {
      var str = '';

      // another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        console.log(str);
      });
    }

    http.request(options, callback).end();


Making a POST request is just as easy. Let's make a POST request to `www.nodejitsu.com:1337`, which is running a server that will echo back what we send. The code for making a POST request is almost identical to making a GET request, with just a few simple modifications:

    var http = require('http');

    //The url we want
    var options = {
      host: 'www.nodejitsu.com',
      path: '/',
      //since we are listening on a custom port, we need to specify it by hand
      port: '1337',
      //This is what changes the request to a POST request
      method: 'POST'
    };

    callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log(str);
      });
    }

    var req = http.request(options, callback);

    //This is the data we are POSTing, it needs to be a string or a buffer
    req.write("hello world!");
    req.end();

Adding custom headers requires a few more steps. `www.nodejitsu.com:1338` is running a server that prints out the `custom` header. We'll just make a quick request to it:

    var http = require('http');

    var options = {
      host: 'www.nodejitsu.com',
      path: '/',
      port: '1338',
      //This is the only line that is new. `headers` is an object with the headers to request
      headers: {'custom': 'Custom Header Demo works'}
    };

    callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        console.log(str);
      });
    }

    var req = http.request(options, callback);
    req.end();&lt/div>

### Creating an HTTP Server

Making a simple HTTP server in Node.js has become the de-facto 'hello world' for the platform. Node.js provides extremely easy-to-use HTTP APIs; in addition, a simple web server also serves as an excellent demonstration of Node's asynchronous strengths.

Let's take a look at a very simple example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=http.server.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

Save this in a file called `server.js`, and from the command line, run `node server.js`. Your program will hang there: it's waiting for connections to respond to, and you'll have to give it one if you want to see it do anything. Open up a browser, and type `localhost:8080` into the location bar. If everything has been set up correctly, you should see your server saying hello!

Let's take a more in-depth look at what the above code is doing.  First, a function is defined called `requestListener` that takes a `request` object  (`req`) and a `response` object (`res`) as parameters. 

The `request` object contains things such as the requested URL, but in this example we ignore it and always return "Hello World!". 

The `response` object is how we send the headers and contents of the response back to the user making the request. Here, we return a 200 response code (signaling a successful response) with the body "Hello World!".  Other headers, such as `Content-type`, would also be set here.

Next, the `http.createServer()` method creates a server that calls `requestListener` whenever a request comes in. The next line, `server.listen(8080)`, calls the `listen` method, which causes the server to wait for incoming requests on the specified port&mdash;8080, in this case. 
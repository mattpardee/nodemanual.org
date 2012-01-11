
/** 
 * class http
 *
 * The HTTP interfaces in Node.js are designed to support many features of the protocol which have been traditionally difficult to use. In particular, large, possibly chunk-encoded, messages. The interface is careful to never buffer entire requests or responses&mdash;the user is always able to stream data. To use the HTTP server and client, add `require('http')` to your code.
 * 
 * HTTP message headers are represented by an object like this:
 * 
 *     { 'content-length': '123',
 *       'content-type': 'text/plain',
 *       'connection': 'keep-alive',
 *       'accept': 'text/plain' }
 * 
 * Keys are lowercased, and values are not modifiable.
 * 
 * In order to support the full spectrum of possible HTTP applications, Node's HTTP API is very low-level. It deals with stream handling and message parsing only. It parses a message into headers and body but it does not parse the actual headers or the body.
 * 
 * #### Example: The famous hello world
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=http.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 *
**/



/**
 * http.get(options, callback()) -> Void
 * - options (Object): Options to pass to the request
 * - callback (Function):  The callback to execute once the method finishes 
 * 
 * Since most requests are GET requests without bodies, Node.js provides this convenience method. The only difference between this method and [[http.request `http.request()`]] is that it sets the method to GET and calls `req.end()` automatically.
 * 
 * #### Example
 * 
 *     var options = {
 *       host: 'www.google.com',
 *       port: 80,
 *       path: '/index.html'
 *     };
 * 
 *     http.get(options, function(res) {
 *       console.log("Got response: " + res.statusCode);
 *     }).on('error', function(e) {
 *       console.log("Got error: " + e.message);
 *     });
 * 
**/ 

/**
 * http.createServer(requestListener()) 
 * - requestListener (Function): A function that is automatically added to the `'request'` event
 *
 * Returns a new web server object.
 *
**/ 

/**
 * http.globalAgent -> Agent
 *
 * This is the global instance of [[http.Agent `http.Agent`]] which is used as the default for all HTTP client requests.
 * 
**/ 

/**
 * http.globalAgent.requests -> Object
 *
 * An object which contains queues of requests that have not yet been assigned to  sockets. **Do not modify this!**
 * 
**/ 
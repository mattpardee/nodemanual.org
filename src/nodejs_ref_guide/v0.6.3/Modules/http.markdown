## HTTP

The HTTP interfaces in Node.js are designed to support many features of the protocol which have been traditionally difficult to use. In particular, large, possibly chunk-encoded, messages. The interface is careful to never buffer entire requests or responses&mdash;the user is always able to stream data. To use the HTTP server and client one must `require('http')` in their code.

HTTP message headers are represented by an object like this:

    { 'content-length': '123',
      'content-type': 'text/plain',
      'connection': 'keep-alive',
      'accept': '*/*' }

Keys are lowercased. Values are not modified.

In order to support the full spectrum of possible HTTP applications, Node's HTTP API is very low-level. It deals with stream handling and message parsing only. It parses a message into headers and body but it does not parse the actual headers or the body.


@obj `http.Server`

### Events

@event `'request'`
@cb `function(request, response)`: The callback to execute once the event fires, `request`: An instance of `http.ServerRequest`, `response`: an instance of `http.ServerResponse`

Emitted each time there is a request. Note that, in the case of keep-alive connections, there may be multiple requests per connection.

@event `'connection'`
@cb `function(socket)`: The callback to execute once the event fires, `socket`: An object of type `net.Socket`

`function (socket) { }`

When a new TCP stream is established. `socket` is . Usually users will not want to access this event. The `socket` can also be accessed at `request.connection`.

@event `'close'`
@cb `function(socket)`: The callback to execute once the event fires

 Emitted when the server closes.

@event `'checkContinue'`
@cb `function(request, response)`: The callback to execute once the event fires, `request`: An instance of `http.ServerRequest`, `response`: an instance of `http.ServerResponse`

Emitted each time a request with an `http Expect: 100-continue` is received. If this event isn't listened for, the server will automatically respond with a `100 Continue` as appropriate.

Handling this event involves calling `response.writeContinue` if the client should continue to send the request body, or generating an appropriate HTTP response (_e.g._ `400 Bad Request`) if the client should not continue to send the request body.

**Note**: when this event is emitted and handled, the `request` event is not be emitted.

@event `'upgrade'`
@cb `function(request, socket, head)`: The callback to execute once the event fires, `request`: The arguments for the http request, as it is in the request event, `socket`: The network socket between the server and client, `head`: An instance of `Buffer`, the first packet of the upgraded stream, this may be empty

Emitted each time a client requests a http upgrade. If this event isn't listened for, then clients requesting an upgrade will have their connections closed.

After this event is emitted, the request's socket will not have a `data` event listener, meaning you will need to bind to it in order to handle data sent to the server on that socket.

@event `'clientError'`
@cb `function(exception)`: The callback to execute once the event fires, `exception` : The exception being thrown

If a client connection emits an `'error'` event, it's forwarded here.

@method `http.createServer([requestListener()])`
@param `[requestListener()]`: A function that is automatically added to the `'request'` event

Returns a new web server object.

@method `server.listen(port, [hostname], [callback()])`
@param `port`: The port to listen to, `[hostname]`: The hostname to listen to, `[callback()]`: The function to execute once the server has been bound to the port

Begin accepting connections on the specified port and hostname. If the hostname is omitted, the server accepts connections directed to any IPv4 address (`INADDR_ANY`).

@method `server.listen(path, [callback])`
@param `path`: The path to listen to, `[callback()]`: The function to execite once the server has been boundt

Start a UNIX socket server listening for connections on the given `path`.

@method `server.close()`

Stops the server from accepting new connections.

### Objects

@obj `http.ServerRequest`

This object is created internally by an HTTP server&mdash;not by the user&mdash;and passed as the first argument to a `'request'` listener.

### Events

@event `'data'`
@cb `function(chunk)`: The callback to execute once the event fires, `chunk` : A big ol' hunk of data that's received (as a string)

Emitted when a piece of the message body is received. For example, a chunk of the body is given as the single argument. The transfer-encoding has been decoded. 

The body encoding is set with `request.setEncoding()`.

@event `'end'`
@cb `function()`: The callback to execute once the event fires

Emitted exactly once for each request. After that, no more `'data'` events are emitted on the request.

@event `'close'`
@cb `function()`: The callback to execute once the event fires

Indicates that the underlaying connection was terminated before `response.end()` was called or able to flush.

Just like `'end'`, this event occurs only once per request, and no more `'data'` events will fire afterwards.

Note: `'close'` can fire after `'end'`, but not vice versa.

### Properties 

@prop <span class="label notice">Read-Only</span> `request.method`

The request method as a string like `'GET'` or `'DELETE'`.

@prop `request.url`

Request URL string. This contains only the URL that is present in the actual HTTP request. If the request is:

    GET /status?name=ryan HTTP/1.1\r\n
    Accept: text/plain\r\n
    \r\n

Then `request.url` becomes:

    '/status?name=ryan'

If you would like to parse the URL into its parts, you can use `require('url').parse(request.url)`. For example:

    node> require('url').parse('/status?name=ryan')
    { href: '/status?name=ryan',
      search: '?name=ryan',
      query: 'name=ryan',
      pathname: '/status' }

If you would like to extract the params from the query string, you can use the `require('querystring').parse` function, or pass `true` as the second argument to `require('url').parse`.  For example:

    node> require('url').parse('/status?name=ryan', true)
    { href: '/status?name=ryan',
      search: '?name=ryan',
      query: { name: 'ryan' },
      pathname: '/status' }


@prop <span class="label notice">Read-Only</span> `request.headers`

Returns the request header.

@prop <span class="label notice">Read-Only</span> `request.trailers`

Contains the HTTP trailers (if present). Only populated after the `'end'` event.

@prop <span class="label notice">Read-Only</span> `request.httpVersion`

The HTTP protocol version as a string; for example: `'1.1'`, `'1.0'`. Also `request.httpVersionMajor` is the first integer and `request.httpVersionMinor` is the second.

@method `request.setEncoding(encoding=null)`
@param `encoding`: The encoding to use, either `'utf8'` or `'binary'`

Set the encoding for the request body. Defaults to `null`, which means that the `'data'` event emits a `Buffer` object..

@method `request.pause()`

Pauses request from emitting events.  Useful to throttle back an upload.

@method `request.resume()`

Resumes a paused request.

@prop `request.connection`

The `net.Socket` object associated with the connection.

With HTTPS support, use `request.connection.verifyPeer()` and `request.connection.getPeerCertificate()` to obtain the client's authentication details.

@obj http.ServerResponse

This object is created internally by a HTTP server&mdash;not by the user. It is passed as the second parameter to the `'request'` event. It is a `Writable Stream`.

@method `response.writeContinue()`

Sends an `HTTP/1.1 100 Continue` message to the client, indicating that the request body should be sent. See the [checkContinue](#event_checkContinue_) event on `Server`.

@method `response.writeHead(statusCode, [reasonPhrase], [headers])`
@param `statusCode`: The 3-digit HTTP status code, like `404`, `reasonPhrase`: A human-readable string describing the status, `headers`: Any response headers

Sends a response header to the request.

This method must only be called once on a message and it must be called before `response.end()` is called.

If you call `response.write()` or `response.end()` before calling this, the implicit/mutable headers will be calculated and call this function for you.

#### Example 

    var body = 'hello world';
    response.writeHead(200, {
      'Content-Length': body.length,
      'Content-Type': 'text/plain' });

<span class="label success">Note</span> `Content-Length` is given in bytes not characters. The above example works because the string `'hello world'` contains only single byte characters. If the body contains higher coded characters then `Buffer.byteLength()` should be used to determine the number of bytes in a given encoding. Node.js does not check whether `Content-Length` and the length of the body which has been transmitted are equal or not.

@prop `response.statusCode`

When using implicit headers (not calling `response.writeHead()` explicitly), this property controls the status code that will be send to the client when the headers get flushed. For example: `response.statusCode = 404;`. 

After response header is sent to the client, this property indicates the status code which was sent out.

@method `response.setHeader(name, value)`
@param `name`: The name of the header to set, `value`: The value to set

Sets a single header value for implicit headers. If this header already exists
in the to-be-sent headers, its value is replaced.  Use an array of strings here if you need to send multiple headers with the same name.

#### Examples

    response.setHeader("Content-Type", "text/html");

    response.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);


@method `response.getHeader(name)`
@param `name`: The name of the header to retrieve

Reads out a header that's already been queued but not sent to the client.  Note that the name is case-insensitive.  This can only be called before headers get implicitly flushed.

#### Example

    var contentType = response.getHeader('content-type');

@method `response.removeHeader(name)`

Removes a header that's queued for implicit sending. For example:

    response.removeHeader("Content-Encoding");

@method `response.write(chunk, encoding='utf8')`
@param `chunk`: A string or buffer to write, `encoding`: The encoding to use (if `chunk` is a string)

If this method is called and `response.writeHead()` has not been called, it'll switch to implicit header mode and flush the implicit headers.

This sends a chunk of the response body. This method may be called multiple times to provide successive parts of the body.

<span class="label success">New</span> This is the raw HTTP body and has nothing to do with higher-level multi-part body encodings that may be used.

The first time `response.write()` is called, it sends the buffered header information and the first body to the client. The second time `response.write()` is called, Node.js assumes you're going to be streaming data, and sends that separately. That is, the response is buffered up to the first chunk of body.

@method `response.addTrailers(headers)`
@param `headers`: The trailing header to add

This method adds HTTP trailing headers (a header, but at the end of the message) to the response.

Trailers are only emitted if chunked encoding is used for the response; if it is not (_e.g._ if the request was HTTP/1.0), they are silently discarded.

**Note**: HTTP requires the `Trailer` header to be sent if you intend to emit trailers, with a list of the header fields in its value. For example:

    response.writeHead(200, { 'Content-Type': 'text/plain',
                              'Trailer': 'Content-MD5' });
    response.write(fileData);
    response.addTrailers({'Content-MD5': "7895bf4b8828b55ceaf47747b4bca667"});
    response.end();


@method `response.end([data], [encoding])`
@param `data`: Some data to write before finishing, `encoding`: The encoding for the data

This method signals to the server that all of the response headers and body has been sent; that server should consider this message complete. `response.end()` **must** be called on each response.

If `data` is specified, it is equivalent to calling `response.write(data, encoding)` followed by `response.end()`.

@method `http.request(options, callback())`
@param `options`: Options to pass to the request, `callback()`: The callback to execute once the method finishes

Node.js maintains several connections per server to make HTTP requests. This function allows one to transparently issue requests.  

The `options` align with [url.parse()](url.html#url.parse):

- `host`: a domain name or IP address of the server to issue the request to. Defaults to `'localhost'`.
- `hostname`: this supports `url.parse()`; `hostname` is prefered over `host`
- `port`: the port of the remote server. Defaults to `80`.
- `socketPath`: the Unix Domain Socket (use either `host:port` or `socketPath`)
- `method`: a string specifying the HTTP request method. Defaults to `'GET'`.
- `path`: the request path. Defaults to `'/'`. This should include a query string (if any) For example, `'/index.html?page=12'`
- `headers`: an object containing request headers
- `auth`: used for basic authentication. For example, `'user:password'` computes an Authorization header.
- `agent`: this controls [Agent](#http.Agent) behavior. When an Agent is used, the request defaults to `Connection: keep-alive`. The possible values are:
 - `undefined`: uses [global Agent](#http.globalAgent) for this host
   and port (default).
 - `Agent` object: this explicitlys use the passed in `Agent`
 - `false`: this opts out of connection pooling with an Agent, and defaults the request to `Connection: close`.

`http.request()` returns an instance of the `http.ClientRequest` class. The `ClientRequest` instance is a writable stream. If one needs to upload a file with a POST request, then write it to the `ClientRequest` object.

### Example

    var options = {
      host: 'www.google.com',
      port: 80,
      path: '/upload',
      method: 'POST'
    };

    var req = http.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();

Note that in the example, `req.end()` was called. With `http.request()` one must always call `req.end()` to signify that you're done with the request&mdash;even if there is no data being written to the request body.

If any error is encountered during the request (be that with DNS resolution, TCP level errors, or actual HTTP parse errors) an `'error'` event is emitted on the returned request object.

There are a few special headers that should be noted.

* Sending a `'Connection: keep-alive'` notifies Node.js that the connection to the server should be persisted until the next request.

* Sending a `'Content-length'` header disables the default chunked encoding.

* Sending an 'Expect' header immediately sends the request headers.
  Usually, when sending `'Expect: 100-continue'`, you should both set a timeout
  and listen for the `continue` event. For more information, see [RFC2616 Section 8.2.3](http://tools.ietf.org/html/rfc2616#section-8.2.3).

* Sending an Authorization header overrides using the `auth` option to compute basic authentication.

@method `http.get(options, callback)`
@param 

Since most requests are GET requests without bodies, Node.js provides this convenience method. The only difference between this method and `http.request()` is that it sets the method to GET and calls `req.end()` automatically.

### Example

    var options = {
      host: 'www.google.com',
      port: 80,
      path: '/index.html'
    };

    http.get(options, function(res) {
      console.log("Got response: " + res.statusCode);
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });


@obj http.Agent

Starting with Node.js version 0.5.3, there's a new implementation of the HTTP Agent which is used for pooling sockets used in HTTP client requests.

Previously, a single agent instance help the pool for single host+port. The current implementation now holds sockets for any number of hosts.

The current HTTP Agent also defaults client requests to using `Connection:keep-alive`. If no pending HTTP requests are waiting on a socket to become free ,the socket is closed. This means that Node's pool has the benefit of keep-alive when under load but still does not require developers to manually close the HTTP clients using keep-alive.

Sockets are removed from the agent's pool when the socket emits either a "close" event or a special "agentRemove" event. This means that if you intend to keep one HTTP request open for a long time and don't want it to stay in the pool you can do something along the lines of:

    http.get(options, function(res) {
      // Do stuff
    }).on("socket", function (socket) {
      socket.emit("agentRemove");
    });

Alternatively, you could just opt out of pooling entirely using `agent:false`:

    http.get({host:'localhost', port:80, path:'/', agent:false}, function (res) {
      // Do stuff
    })

@obj `http.globalAgent`

This is the global instance of `Agent` which is used as the default for all HTTP client requests.

@prop `agent.maxSockets`

Determines how many concurrent sockets the agent can have open per host. By default, this is set to 5. 

@obj `agent.sockets`

An object which contains arrays of sockets currently in use by the Agent. **Do not  modify this!**

@prop `agent.requests`

An object which contains queues of requests that have not yet been assigned to  sockets. **Do not  modify this!**

@obj `http.ClientRequest`

This object is created internally and returned from `http.request()`.  It represents an _in-progress_ request whose header has already been queued.  The header is still mutable using the `setHeader(name, value)`, `getHeader(name)`, and `removeHeader(name)` methods.  The actual header will be sent along with the first data chunk or when closing the connection.

To get the response, add a listener for `'response'` to the request object. `'response'` will be emitted from the request object when the response headers have been received.  The `'response'` event is executed with one argument which is an instance of `http.ClientResponse`.

During the `'response'` event, one can add listeners to the response object, particularly to listen for the `'data'` event. Note that the `'response'` event is called before any part of the response body is received, so there is no need to worry about racing to catch the first part of the body. As long as a listener for `'data'` is added during the `'response'` event, the entire body will be caught.

### Example

    // Good
    request.on('response', function (response) {
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    });

    // Bad - misses all or part of the body
    request.on('response', function (response) {
      setTimeout(function () {
        response.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      }, 10);
    });



<span class="label success">Note</span> Node.js does not check whether `Content-Length`and the length of the body which has been transmitted are equal or not.

This is a `Writable Stream` and `EventEmitter` with the following events:

### Events

@event `'response'`
@obj `function (response)`: : The callback to execute once the event fires, `response` : An instance of `http.ClientResponse`

Emitted when a response is received to this request. This event is emitted only once. 

Options include:

- `host`: a domain name or IP address of the server to issue the request to
- `port`: the port of remote server
- `socketPath`: Unix Domain Socket (use either `host:port` or `socketPath`)

@event `'socket'`
@cb `function (socket)`: The callback to execute once the event fires, `socket` : The assigned socket

Emitted after a socket is assigned to this request.

@event `'upgrade'`
@cb `function (response, socket, head)`: The callback to execute once the event fires, `response` : The response, `socket`: The assigned socket, `head`: The upgrade header

Emitted each time a server responds to a request with an upgrade. If this event isn't being listened for, clients receiving an upgrade header will have their connections closed.

### Example

A client server pair that show you how to listen for the `upgrade` event using `http.getAgent`:

    var http = require('http');
    var net = require('net');

    // Create an HTTP server
    var srv = http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('okay');
    });
    srv.on('upgrade', function(req, socket, upgradeHead) {
      socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
                   'Upgrade: WebSocket\r\n' +
                   'Connection: Upgrade\r\n' +
                   '\r\n\r\n');

      socket.ondata = function(data, start, end) {
        socket.write(data.toString('utf8', start, end), 'utf8'); // echo back
      };
    });

    // now that server is running
    srv.listen(1337, '127.0.0.1', function() {

      // make a request
      var options = {
        port: 1337,
        host: '127.0.0.1',
        headers: {
          'Connection': 'Upgrade',
          'Upgrade': 'websocket'
        }
      };

      var req = http.request(options);
      req.end();

      req.on('upgrade', function(res, socket, upgradeHead) {
        console.log('got upgraded!');
        socket.end();
        process.exit(0);
      });
    });

@event `'continue'`
@cb `function()`: The function to execite when the event fires
`function ()`

Emitted when the server sends a `'100 Continue'` HTTP response, usually because the request contained `'Expect: 100-continue'`. This is an instruction that the client should send the request body.

### Methods

@method `request.write(chunk, [encoding='utf8'])`
@param `chunk`: An array of integers or a string, `encoding`: The encoding of the chunk (but only if it's a string)

Sends a chunk of the body.  By calling this method many times, the user can stream a request body to a server&mdash;in that case, it's suggested you use the `['Transfer-Encoding', 'chunked']` header line when creating the request.

@method `request.end([data], [encoding])`
@param `data`: The data to send at the end, `encoding`: The encoding to use for the data 

Finishes sending the request. If any parts of the body are unsent, it will flush them to the stream. If the request is chunked, this will send the terminating `'0\r\n\r\n'`.

If `data` is specified, it is equivalent to calling `request.write(data, encoding)`
followed by `request.end()`.

### request.abort()

Aborts a request.  (New since v0.3.8.)

### request.setTimeout(timeout, [callback])

Once a socket is assigned to this request and is connected 
[socket.setTimeout(timeout, [callback])](net.html#socket.setTimeout)
will be called.

### request.setNoDelay(noDelay=true)

Once a socket is assigned to this request and is connected 
[socket.setNoDelay(noDelay)](net.html#socket.setNoDelay)
will be called.

### request.setSocketKeepAlive(enable=false, [initialDelay])

Once a socket is assigned to this request and is connected 
[socket.setKeepAlive(enable, [initialDelay])](net.html#socket.setKeepAlive)
will be called.

## http.ClientResponse

This object is created when making a request with `http.request()`. It is
passed to the `'response'` event of the request object.

The response implements the `Readable Stream` interface.

### Event: 'data'

`function (chunk) { }`

Emitted when a piece of the message body is received.


### Event: 'end'

`function () { }`

Emitted exactly once for each message. No arguments. After
emitted no other events will be emitted on the response.

### Event: 'close'

`function (err) { }`

Indicates that the underlaying connection was terminated before
`end` event was emitted.
See [http.ServerRequest](#http.ServerRequest)'s `'close'` event for more
information.

### response.statusCode

The 3-digit HTTP response status code. E.G. `404`.

### response.httpVersion

The HTTP version of the connected-to server. Probably either
`'1.1'` or `'1.0'`.
Also `response.httpVersionMajor` is the first integer and
`response.httpVersionMinor` is the second.

### response.headers

The response headers object.

### response.trailers

The response trailers object. Only populated after the 'end' event.

### response.setEncoding(encoding=null)

Set the encoding for the response body. Either `'utf8'`, `'ascii'`, or `'base64'`.
Defaults to `null`, which means that the `'data'` event will emit a `Buffer` object..

### response.pause()

Pauses response from emitting events.  Useful to throttle back a download.

### response.resume()

Resumes a paused response.

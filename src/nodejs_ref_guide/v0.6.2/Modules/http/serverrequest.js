
/**
 * class http.ServerRequest
 * 
 * This object is created internally by an HTTP server&mdash;not by the user&mdash;and passed as the first argument to a `'request'` listener.
 * 
**/ 

/**
 * http.ServerRequest@data(chunk)
 * - chunk (String): The data that's received (as a string)
 * 
 * Emitted when a piece of the message body is received. For example, a chunk of the body is given as the single argument. The transfer-encoding has been decoded. 
 * 
 * The body encoding is set with [[http.ServerRequest.setEncoding `request.setEncoding()`]].
 *
**/ 

/**
 * http.ServerRequest@end()
 *
 * Emitted exactly once for each request. After that, no more `'data'` events are emitted on the request.
 *
 * 
**/ 

/**
 * http.ServerRequest@close()
 *
 * Indicates that the underlaying connection was terminated before `response.end()` was called or able to flush.
 * 
 * Just like `'end'`, this event occurs only once per request, and no more `'data'` events will fire afterwards.
 * 
 * <Note>`'close'` can fire after `'end'`, but not vice versa.</Note>
**/ 

/** read-only
 * http.ServerRequest.method -> String
 * 
 * The request method as a string, like `'GET'` or `'DELETE'`.
 *
**/ 


/**
 * http.ServerRequest.url -> String
 *
 * Request URL string. This contains only the URL that is present in the actual HTTP request. Fo example, if the request is:
 * 
 *     GET /status?name=ryan HTTP/1.1\r\n
 *     Accept: text/plain\r\n
 *     \r\n
 * 
 * Then `request.url` becomes:
 * 
 *     '/status?name=ryan'
 * 
 * #### Example
 *
 * If you would like to parse the URL into its parts, you can use `require('url').parse(request.url)`. For example:
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=http.serverrequest_1.url&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 * 
 * If you would like to extract the params from the query string, you can use [[querystring.parse `require('querystring').parse()`]], or pass `true` as the second argument to `require('url').parse`.  For example:
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=http.serverrequest_2.url&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 *
*/

/** read-only
 * http.ServerRequest.headers -> Object
 *
 * Returns the request header.
 *
 * 
**/ 

/** read-only
 * http.ServerRequest.trailers -> Object
 * 
 * Contains the HTTP trailers (if present). Only populated after the `'end'` event.
 * 
 * 
**/ 

/** read-only
 * http.ServerRequest.httpVersion -> String
 *
 * The HTTP protocol version as a string; for example: `'1.1'`, `'1.0'`. `request.httpVersionMajor` is the first integer and `request.httpVersionMinor` is the second.
 * 
 * 
**/ 

/**
 * http.ServerRequest.setEncoding(encoding=null) -> Void
 * - encoding (String): The encoding to use, either `'utf8'` or `'binary'`
 *
 * Set the encoding for the request body. Defaults to `null`, which means that the `'data'` event emits a `Buffer` object.
 *
 *  
**/ 

/**
 * http.ServerRequest.pause() -> Void
 *
 * Pauses request from emitting events.  Useful to throttle back an upload.  
**/ 

/**
 * http.ServerRequest.resume() -> Void
 *
 * Resumes a paused request.
 * 
**/ 

/**
 * http.ServerRequest.connection -> net.Socket
 *
 * The `net.Socket` object associated with the connection.
 *
 * With HTTPS support, use `request.connection.verifyPeer()` and `request.connection.getPeerCertificate()` to obtain the client's authentication details.
 *
**/ 

/**
 * http.ServerRequest.request(options, callback()) -> http.ClientRequest
 *
 * - options (Object): Options to pass to the request
 * - callback (Function):  The callback to execute once the method finishes
 * 
 * Node.js maintains several connections per server to make HTTP requests. This function allows one to transparently issue requests.  
 * 
 * The `options` align with the return value of [[url.parse `url.parse()`]]:
 * 
 * - `host`: a domain name or IP address of the server to issue the request to. Defaults to `'localhost'`.
 * - `hostname`: To support `url.parse()`, `hostname` is prefered over `host`
 * - `port`: the port of the remote server. Defaults to `80`.
 * - `socketPath`: the Unix Domain Socket (in other words, use either `host:port` or `socketPath`)
 * - `method`: a string specifying the HTTP request method. Defaults to `'GET'`.
 * - `path`: the request path. Defaults to `'/'`. This should include a query string (if any) For example, `'/index.html?page=12'`
 * - `headers`: an object containing request headers
 * - `auth`: used for basic authentication. For example, `'user:password'` computes an Authorization header.
 * - `agent`: this controls [[http.Agent `http.Agent]] behavior. When an Agent is used, the request defaults to `Connection: keep-alive`. The possible values are:
 *  -- `undefined`: uses [[http.globalAgent the global Agent]] for this host
 *    and port (default).
 *  -- `Agent` object: explicitly use the passed in `Agent`
 *  -- `false`: opt out of connection pooling with an `Agent`, and default the request to `Connection: close`.
 * 
 * There are a few special headers that should be noted.
 * 
 * * Sending a `'Connection: keep-alive'` notifies Node.js that the connection to the server should be persisted until the next request.
 * 
 * * Sending a `'Content-length'` header disables the default chunked encoding.
 * 
 * * Sending an 'Expect' header immediately sends the request headers.
 *   Usually, when sending `'Expect: 100-continue'`, you should both set a timeout
 *   and listen for the `continue` event. For more information, see [RFC2616 Section 8.2.3](http://tools.ietf.org/html/rfc2616#section-8.2.3).
 * 
 * * Sending an Authorization header overrides using the `auth` option to compute basic authentication.
 *
 * #### Example
 * 
 *     var options = {
 *       host: 'www.google.com',
 *       port: 80,
 *       path: '/upload',
 *       method: 'POST'
 *     };
 * 
 *     var req = http.request(options, function(res) {
 *       console.log('STATUS: ' + res.statusCode);
 *       console.log('HEADERS: ' + JSON.stringify(res.headers));
 *       res.setEncoding('utf8');
 *       res.on('data', function (chunk) {
 *         console.log('BODY: ' + chunk);
 *       });
 *     });
 * 
 *     req.on('error', function(e) {
 *       console.log('problem with request: ' + e.message);
 *     });
 * 
 *     // write data to request body
 *     req.write('data\n');
 *     req.write('data\n');
 *     req.end();
 * 
 * Note that in the example, `req.end()` was called. With `http.request()` one must always call `req.end()` to signify that you're done with the request&mdash;even if there is no data being written to the request body.
 * 
 * Returns
 *
 * An instance of the `http.ClientRequest` class. The `ClientRequest` instance is a writable stream. If one needs to upload a file with a POST request, then write it to the `ClientRequest` object.
 *
 * If any error is encountered during the request (be that with DNS resolution, TCP level errors, or actual HTTP parse errors) an `'error'` event is emitted on the returned request object.
 * 
**/ 
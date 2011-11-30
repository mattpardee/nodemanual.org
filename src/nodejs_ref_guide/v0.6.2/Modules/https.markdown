## HTTPS

HTTPS is the HTTP protocol over TLS/SSL. In Node.js, this is implemented as a separate module.

@obj `https.Server`

This class is a subclass of `tls.Server` and emits the same events as `http.Server`. For more information, see `http.Server`.

@method `https.createServer(options, [requestListener])`
@param `options`: Any options you want to pass to the server, `requestListener`: An optional listener

Returns a new HTTPS web server object. 

The `options` object has a mix of required and optional values:

  - `key`: A string or `Buffer` containing the private key of the server in a PEM format. (Required)
  - `cert`: A string or `Buffer` containing the certificate key of the server in a PEM format. (Required)

  - `ca`: An array of strings or `Buffer`s of trusted certificates. These are used to authorize connections. If this is omitted, several "well-known root" CAs will be used, like VeriSign. 

  - `NPNProtocols`: An array of strings or a  `Buffer` containing supported NPN protocols. 
        `Buffer` should have the following format: `0x05hello0x05world`, where the preceding byte indicates the following protocol name's length. Passing an array is usually much simplier: `['hello', 'world']`. 
        Protocols should be ordered by their priority.

  - `passphrase`: A string of a passphrase for the private key.

  - `rejectUnauthorized`: If `true` the server rejects any connection that is not authorized with the list of supplied CAs. This option only has an effect if `requestCert` is `true`. This defaults to `false`.

  - `requestCert`: If `true` the server requests a certificate from clients that connect and attempt to verify that certificate. This defaults to `false`.

  - `sessionIdContext`: A string containing an opaque identifier for session resumption. If `requestCert` is `true`, the default is an MD5 hash value generated from the command line. Otherwise, the default is not provided.

  - `SNICallback`: A function that is called if the client supports the SNI TLS extension. Only one argument will be passed to it: `servername`. `SNICallback` should return a SecureContext instance. You can use `crypto.createCredentials(...).context` to get a proper SecureContext. If `SNICallback` wasn't provided, a default callback within the high-level API is used (for more information, see below).

The `requestListener` is a function which is automatically added to the `'request'` event.

### Examples

    // curl -k https://localhost:8000/
    var https = require('https');
    var fs = require('fs');

    var options = {
      key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
      cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
    };

    https.createServer(options, function (req, res) {
      res.writeHead(200);
      res.end("hello world\n");
    }).listen(8000);


@method `https.request(options, callback())`
@param `options`: Any options you want to pass to the server, `callback()`: The callback to execute

Makes a request to a secure web server. 

All options from [http.request()](http.html#http.request) are valid for `options`:

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

The following options from [tls.connect()](tls.html#tls.connect) can also be
specified. However, a [globalAgent](#https.globalAgent) silently ignores these.

  - `key`: A string or `Buffer` containing the private key of the client in aPEM format. The default is `null`.

  - `passphrase`: A string of a passphrase for the private key. The default is `null`.

  - `cert`: A string or `Buffer` containing the certificate key of the client in a PEM format; in other words, the public x509 certificate to use. The default is `null`.

  - `ca`: An array of strings or `Buffer`s of trusted certificates. These are used to authorize connections. If this is omitted, several "well-known root" CAs will be used, like VeriSign. 

### Example

    var https = require('https');

    var options = {
      host: 'encrypted.google.com',
      port: 443,
      path: '/',
      method: 'GET'
    };

    var req = https.request(options, function(res) {
      console.log("statusCode: ", res.statusCode);
      console.log("headers: ", res.headers);

      res.on('data', function(d) {
        process.stdout.write(d);
      });
    });
    req.end();

    req.on('error', function(e) {
      console.error(e);
    });

Here's an example specifying these options using a custom `Agent`:

    var options = {
      host: 'encrypted.google.com',
      port: 443,
      path: '/',
      method: 'GET',
      key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
      cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
    };
    options.agent = new https.Agent(options);

    var req = https.request(options, function(res) {
      ...
    }

Or, if you choose not to use an `Agent`:

    var options = {
      host: 'encrypted.google.com',
      port: 443,
      path: '/',
      method: 'GET',
      key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
      cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem'),
      agent: false
    };

    var req = https.request(options, function(res) {
      ...
    }

@method `https.get(options, callback)`

Exactly like `http.get()` but for HTTPS.

### Example

    var https = require('https');

    https.get({ host: 'encrypted.google.com', path: '/' }, function(res) {
      console.log("statusCode: ", res.statusCode);
      console.log("headers: ", res.headers);

      res.on('data', function(d) {
        process.stdout.write(d);
      });

    }).on('error', function(e) {
      console.error(e);
    });


@obj `https.Agent`

An `Agent` object for HTTPS, similar to [http.Agent](http.html#http.Agent). For more information, see [https.request()](#https.request).


@prop `https.globalAgent`

A global instance of the [https.Agent](#https.Agent), which is used as the default for all HTTPS client requests.

## tls

> Stability: 3 - Stable
    
The `tls` module uses OpenSSL to provide both the Transport Layer Security and
the Secure Socket Layer; in other words, it provides encrypted stream
communications. To access this module, add `require('tls')` in your code. 

TLS/SSL is a public/private key infrastructure. Each client and each server must
have a private key. A private key is created in your terminal like this:

    openssl genrsa -out ryans-key.pem 1024

where `ryans-key.pm` is the name of your file. All servers (and some clients)
need to have a certificate. Certificates are public keys signed by a Certificate
Authority— or, they are self-signed. The first step to getting a certificate is
to create a "Certificate Signing Request" (CSR) file. This is done using:

    openssl req -new -key ryans-key.pem -out ryans-csr.pem

To create a self-signed certificate with the CSR, enter this:

    openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem

Alternatively, you can send the CSR to a Certificate Authority for signing.

(Documentation on creating a CA are pending; for now, interested users should
just look at
[`test/fixtures/keys/Makefile`](https://github.com/joyent/node/blob/master/test/fixtures/keys/Makefile) in the Node.js source code.)

To create a .pfx or .p12, do this:

    openssl pkcs12 -export -in agent5-cert.pem -inkey agent5-key.pem \
        -certfile ca-cert.pem -out agent5.pfx

where: 

- `in` is the certificate
- `inkey`is the private key
- `certfile`is all the CA certs concatenated in one file, like this:
`cat ca1-cert.pem ca2-cert.pem > ca-cert.pem`

#### Using NPN and SNI

NPN (Next Protocol Negotiation) and SNI (Server Name Indication) are TLS
handshake extensions provided with this module.

NPN is to use one TLS server for multiple protocols (HTTP, SPDY).
SNI is to use one TLS server for multiple hostnames with different SSL
certificates.

##### Client-initiated Renegotiation Attack Mitigation

The TLS protocol lets the client renegotiate certain aspects of the TLS session.
Unfortunately, session renegotiation requires a disproportional amount of
server-side resources, which makes it a potential vector for denial-of-service
attacks.

To mitigate this, renegotiations are limited to three times every 10 minutes. An
error is emitted on the [[tls.CleartextStream CleartextStream]] instance when 
the threshold is exceeded. The limits are configurable:

  - `tls.CLIENT_RENEG_LIMIT`: the renegotiation limit; default is 3.

  - `tls.CLIENT_RENEG_WINDOW`: the renegotiation window in seconds; default is 10 minutes.

Don't change the defaults unless you know what you are doing.

To test your server, connect to it with `openssl s_client -connect address:port`
and tap `R<CR>` (that's the letter `R` followed by a carriage return) a few
times.

### tls@secureConnection(cleartextStream)
- cleartextStream {tls.CleartextStream}  A object containing the NPN and SNI
string protocols

This event is emitted after a new connection has been successfully handshaked.

If [[tls.CleartextStream.authorized `tls.CleartextStream.authorized`]] is
`false`, then [[tls.CleartextStream.authorizationError
`tls.Cleartext.authorizationError`]] is set to describe how the authorization
failed. Depending on the settings of the TLS server, your unauthorized
connections may still be accepted.

`cleartextStream.npnProtocol` is a string containing the selected NPN protocol.
`cleartextStream.servername` is a string containing the servername requested
with SNI.

 

### tls.connect(options, [callback()])
### tls.connect(port [, host=localhost] [, options] [, callback()]),
tls.CleartextStream
- options {Object} Configuration options to pass in
- port {Number}   The port to connect to
- host {String}   An optional hostname to connect to`
- options {Object}   Any options you want to pass to the server
- callback {Function}   An optional listener

Creates a new client connection to the given `port` and `host`. This function
returns a [[tls.CleartextStream `tls.CleartextStream`]] object.

`options` should be an object that specifies the following values:

  - `host`: Host the client should connect to

  - `port`: Port the client should connect to

  - `socket`: Establish secure connection on a given socket rather than
    creating a new socket. If this option is specified, `host` and `port`
    are ignored.

  - `pfx`: A string or `Buffer` containing the private key, certificate and
    CA certs of the server in PFX or PKCS12 format.

  - `key`: A string or `Buffer` containing the private key of the client in aPEM
format. The default is `null`.

  - `passphrase`: A string of a passphrase for the private key. The default is
`null`.

  - `cert`: A string or `Buffer` containing the certificate key of the client in
a PEM format; in other words, the public x509 certificate to use. The default is
`null`.

  - `ca`: An array of strings or `Buffer`s of trusted certificates. These are
used to authorize connections. If this is omitted, several "well-known root" CAs
will be used, like VeriSign. 

  - `rejectUnauthorized`: If `true`, the server certificate is verified against
    the list of supplied CAs. An `'error'` event is emitted if verification
    fails. Default to  `false`.


  - `NPNProtocols`: An array of strings or a  `Buffer` containing supported NPN
protocols. 
        `Buffer` should have the following format: `0x05hello0x05world`, where
the preceding byte indicates the following protocol name's length. Passing an
array is usually much simpler: `['hello', 'world']`. 
        Protocols should be ordered by their priority.

  - `servername`: The server name for the SNI (Server Name Indication) TLS
extension.

`callback` automatically sets a listener for the
[`secureConnection`](#tls.event.secureConnection) event.


#### Example: Connecting to an echo server on port 8000:

    var tls = require('tls');
    var fs = require('fs');

    var options = {
      // These are necessary only if using the client certificate authentication
      key: fs.readFileSync('client-key.pem'),
      cert: fs.readFileSync('client-cert.pem'),
    
      // This is necessary only if the server uses the self-signed certificate
      ca: [ fs.readFileSync('server-cert.pem') ]
    };

    var cleartextStream = tls.connect(8000, options, function() {
      console.log('client connected',
                  cleartextStream.authorized ? 'authorized' : 'unauthorized');
      process.stdin.pipe(cleartextStream);
      process.stdin.resume();
    });
    cleartextStream.setEncoding('utf8');
    cleartextStream.on('data', function(data) {
      console.log(data);
    });
    cleartextStream.on('end', function() {
      server.close();
    });
    
Or, with pfx:

    var tls = require('tls');
    var fs = require('fs');

    var options = {
      pfx: fs.readFileSync('client.pfx')
    };

    var cleartextStream = tls.connect(8000, options, function() {
      console.log('client connected',
                  cleartextStream.authorized ? 'authorized' : 'unauthorized');
      process.stdin.pipe(cleartextStream);
      process.stdin.resume();
    });
    cleartextStream.setEncoding('utf8');
    cleartextStream.on('data', function(data) {
      console.log(data);
    });
    cleartextStream.on('end', function() {
      server.close();
    }); 


### tls.createSecurePair([credentials] [, isServer] [, requestCert] [,
rejectUnauthorized]), tls.SecurePair
- credentials {Object}   An optional credentials object from
[[crypto.createCredentials `crypto.createCredentials()`]]
- isServer {Boolean}   An optional boolean indicating whether this TLS
connection should be opened as a server (`true`) or a client (`false`)
- requestCert {Boolean}  A boolean indicating whether a server should request a
certificate from a connecting client; only applies to server connections
- rejectUnauthorized {Boolean}   A boolean indicating whether a server should
automatically reject clients with invalid certificates; only applies to servers
with `requestCert` enabled

Creates a new secure `pair` object with two streams, one of which reads/writes
encrypted data, and one reads/writes cleartext data. This function returns a
SecurePair object with [[tls.CleartextStream `tls.CleartextStream`]] and
`encrypted` stream properties.

Generally, the encrypted strean is piped to/from an incoming encrypted data
stream, and the cleartext one is used as a replacement for the initial encrypted
stream.

 


### tls.createServer(options [, callback()])
- options {Object}   Any options you want to pass to the server
- callback {Function}  An optional listener, automatically set 
as a listiner for the [[tls@secureConnection `'secureConnection'`]] event.

Creates a new [[tls.Server `tls.Server`]].

The `options` object has the following mix of required values:

  - `pfx`: A string or `Buffer` containing the private key, certificate, and
    CA certs of the server in PFX or PKCS12 format. (Mutually exclusive with
    the `key`, `cert`, and `ca` options.)

  - `key`: A string or `Buffer` containing the private key of the server in a
PEM format. (Required)

  - `cert`: A string or `Buffer` containing the certificate key of the server in
a PEM format. (Required)

`options` also has the following option values:

  - `ca`: An array of strings or `Buffer`s of trusted certificates. These are
used to authorize connections. If this is omitted, several "well-known root" CAs
will be used, like VeriSign. 

  - `crl`: Either a string or list of strings of PEM encoded CRLs (Certificate
    Revocation List)

  - `ciphers`: A string describing the ciphers to use or exclude.

    To mitigate [BEAST attacks](http://blog.ivanristic.com/2011/10/mitigating-the-beast-attack-on-tls.html) it is recommended that you use this option in
    conjunction with the `honorCipherOrder` option described below to
    prioritize the non-CBC cipher.

    Defaults to
    `ECDHE-RSA-AES128-SHA256:AES128-GCM-SHA256:RC4:HIGH:!MD5:!aNULL:!EDH`.
    Consult the [OpenSSL cipher list format documentation](http://www.openssl.org/docs/apps/ciphers.html#CIPHER_LIST_FORMAT) for details on the
    format.

    `ECDHE-RSA-AES128-SHA256` and `AES128-GCM-SHA256` are used when node.js is
    linked against OpenSSL 1.0.1 or newer and the client speaks TLS 1.2, RC4 is
    used as a secure fallback.

    **NOTE**: Previous revisions of this section suggested `AES256-SHA` as an
    acceptable cipher. Unfortunately, `AES256-SHA` is a CBC cipher and therefore
    susceptible to BEAST attacks. Do *not* use it.

  - `honorCipherOrder` : When choosing a cipher, use the server's preferences
    instead of the client preferences.

  - `NPNProtocols`: An array of strings or a  `Buffer` containing supported NPN
protocols. 
        `Buffer` should have the following format: `0x05hello0x05world`, where
the preceding byte indicates the following protocol name's length. Passing an
array is usually much simplier: `['hello', 'world']`. 
        Protocols should be ordered by their priority.

  - `passphrase`: A string of a passphrase for the private key or pfx.

  - `rejectUnauthorized`: If `true` the server rejects any connection that is
not authorized with the list of supplied CAs. This option only has an effect if
`requestCert` is `true`. This defaults to `false`.

  - `requestCert`: If `true` the server requests a certificate from clients that
connect and attempt to verify that certificate. This defaults to `false`.

  - `sessionIdContext`: A string containing an opaque identifier for session
resumption. If `requestCert` is `true`, the default is an MD5 hash value
generated from the command line. Otherwise, the default is not provided.

  - `SNICallback`: A function that is called if the client supports the SNI TLS
extension. Only one argument will be passed to it: `servername`. `SNICallback`
should return a SecureContext instance. You can use
`crypto.createCredentials(...).context` to get a proper SecureContext. If
`SNICallback` wasn't provided, a default callback within the high-level API is
used (for more information, see below).

`callback` automatically sets a listener for the
[`secureConnection`](#tls.event.secureConnection) event.

#### Example

Here's a simple "echo" server:

    var tls = require('tls');
    var fs = require('fs');

    var options = {
      key: fs.readFileSync('server-key.pem'),
      cert: fs.readFileSync('server-cert.pem'),

      // This is necessary only if using the client certificate authentication.
      requestCert: true,

      // This is necessary only if the client uses the self-signed certificate.
      ca: [ fs.readFileSync('client-cert.pem') ]
    };

    var server = tls.createServer(options, function(cleartextStream) {
      console.log('server connected',
                  cleartextStream.authorized ? 'authorized' : 'unauthorized');
      cleartextStream.write("welcome!\n");
      cleartextStream.setEncoding('utf8');
      cleartextStream.pipe(cleartextStream);
    });
    server.listen(8000, function() {
      console.log('server bound');
    });

Or, with pfx:

    var tls = require('tls');
    var fs = require('fs');

    var options = {
      pfx: fs.readFileSync('server.pfx'),

      // This is necessary only if using the client certificate authentication.
      requestCert: true,

    };

    var server = tls.createServer(options, function(cleartextStream) {
      console.log('server connected',
                  cleartextStream.authorized ? 'authorized' : 'unauthorized');
      cleartextStream.write("welcome!\n");
      cleartextStream.setEncoding('utf8');
      cleartextStream.pipe(cleartextStream);
    });
    server.listen(8000, function() {
      console.log('server bound');
    });

You can test this server by connecting to it with `openssl s_client`:

    openssl s_client -connect 127.0.0.1:8000

## tls.Server

This class is a subclass of [[net.Server `net.Server`]] and has the same methods
as it. However, instead of accepting just raw TCP connections, it also accepts
encrypted connections using TLS or SSL.

### tls.Server.addContext(hostname, credentials)
- hostname {String}   The hostname to match
- credentials {Object}   The credentials to use

Add secure context that will be used if client request's SNI hostname is
matching passed `hostname` (wildcards can be used). `credentials` can contain
`key`, `cert`, and `ca`.

#### Example
    var serverResults = [];

    var server = tls.createServer(serverOptions, function(c) {
      serverResults.push(c.servername);
    });

    server.addContext('a.example.com', SNIContexts['a.example.com']);
    server.addContext('*.test.com', SNIContexts['asterisk.test.com']);

    server.listen(1337);

### tls.Server.address(), String

Returns the bound address and port of the server as reported by the operating
system. 

For more information, see [[net.Server.address `net.Server.address()`]].

### tls.Server.close()


Stops the server from accepting new connections. This function is asynchronous,
and the server is finally closed when it emits a `'close'` event.

### tls.Server.listen(port, [host], [callback()])
- port {Number}  The specific port to listen to
- host {String}   An optional host to listen to
- callback {Function}   An optional callback to execute when the server has been
bound

Begin accepting connections on the specified `port` and `host`.  If the `host`
is omitted, the server will accept connections directed to any IPv4 address
(`INADDR_ANY`).

For more information, see [[net.Server `net.Server`]].

### tls.Server.pause(msecs=1000)
- msecs {Number}  The number of milliseconds to pause for

Stop accepting connections for the given number of milliseconds. This could be
useful for throttling new connections against DoS attacks or other
oversubscriptions.

### tls.Server.connections, Number

The number of concurrent connections on the server.


### tls.Server.maxConnections, Number

Set this property to reject connections when the server's connection count gets
high.

## tls.SecurePair

Returned by [[tls.createSecurePair `tls.createSecurePair()`]].

### tls.SecurePair@secure()

The event is emitted from the SecurePair once the pair has successfully
established a secure connection.

Similar to the checking for the server `'secureConnection'` event,
[[tls.CleartextStream.authorized `tls.CleartextStream.authorized`]] should be
checked to confirm whether the certificate used properly authorized.


## tls.CleartextStream

This is a stream on top of the encrypted stream that makes it possible to
read/write an encrypted data as a cleartext data.

This instance implements the duplex [[stream `Stream`]] interfaces. It has all
the common stream methods and events.

### tls.CleartextStream@secureConnect()

This event is emitted after a new connection has been successfully handshaked.
The listener will be called no matter if the server's certificate was authorized
or not. 

It is up to the user to test `cleartextStream.authorized` to see if the server
certificate was signed by one of the specified CAs. If
`cleartextStream.authorized === false`, then the error can be found in
`cleartextStream.authorizationError`. Also if NPN was used, you can check
`cleartextStream.npnProtocol` for the negotiated protocol.
  

### tls.CleartextStream@clientError(exception)
- exception {Error}  The standard Error object

If a client connection emits an 'error' event before a secure connection is
established, this event is triggered, and the error is passed along.

 
### tls.CleartextStream.authorized, Boolean

If `true`, the peer certificate was signed by one of the specified CAs;
otherwise, `false`.

### tls.CleartextStream.authorizationError, Error


The reason why the peer's certificate has not been verified. This property
becomes available only when `cleartextStream.authorized === false`.




### tls.CleartextStream.getPeerCertificate(), Object


Returns an object representing the peer's certificate. The returned object has
some properties corresponding to the field of the certificate.

If the peer does not provide a certificate, it returns `null` or an empty
object.

#### Example

    { subject: 
       { C: 'UK',
         ST: 'Acknack Ltd',
         L: 'Rhys Jones',
         O: 'node.js',
         OU: 'Test TLS Certificate',
         CN: 'localhost' },
      issuer: 
       { C: 'UK',
         ST: 'Acknack Ltd',
         L: 'Rhys Jones',
         O: 'node.js',
         OU: 'Test TLS Certificate',
         CN: 'localhost' },
         valid_from: 'Nov 11 09:52:22 2009 GMT',
         valid_to: 'Nov  6 09:52:22 2029 GMT',
        fingerprint:
'2A:7A:C2:DD:E5:F9:CC:53:72:35:99:7A:02:5A:71:38:52:EC:8A:DF' }
 

### tls.CleartextStream.getCipher(), Object

Returns an object representing the cipher name and the SSL/TLS
protocol version of the current connection. The format is:

  { name: 'AES256-SHA', version: 'TLSv1/SSLv3' }

See SSL_CIPHER_get_name() and SSL_CIPHER_get_version() in
<http://www.openssl.org/docs/ssl/ssl.html#DEALING_WITH_CIPHERS> for more
information.

### tls.CleartextStream.address(), Object
+ {Object} An object with three properties, e.g.
`{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`

Returns the bound address, the address family name, and port of the
underlying socket as reported by the operating system. 

### tls.CleartextStream.connections(), Object

Returns the bound address and port of the underlying socket as reported by the
operating system. The object has two properties, _e.g._
`{"address":"192.168.57.1", "port":62053}`



### tls.CleartextStream.remoteAddress, String

The string representation of the remote IP address. For example,
`'74.125.127.100'` or `'2001:4860:a005::68'`.

 


### tls.CleartextStream.remotePort, Number

The numeric representation of the remote port. For example, `443`.

 




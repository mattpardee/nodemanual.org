## Implementing TLS & SSL

The `tls` module uses OpenSSL to provide both the Transport Layer Security and the Secure Socket Layer; in other words, encrypted stream communications. 

TLS/SSL is a public/private key infrastructure. Each client and each server must have a private key. A private key is created in your terminal like this:

    openssl genrsa -out ryans-key.pem 1024

where `ryans-key.pm` is the name of your file. All servers (and some clients) need to have a certificate. Certificates are public keys signed by a Certificate Authority&mdash;or they are self-signed. The first step to getting a certificate is to create a "Certificate Signing Request" (CSR) file. This is done using:

    openssl req -new -key ryans-key.pem -out ryans-csr.pem

To create a self-signed certificate with the CSR, enter this:

    openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem

Alternatively, you can send the CSR to a Certificate Authority for signing.

(Docs on creating a CA are pending;, for now, interested users should just look at `test/fixtures/keys/Makefile` in the Node.js source code.)

To access this module, add `require('tls')` in your code. 

### Using STARTTLS

As of the v0.4 Node.js branch, no function exists for starting a TLS session on an already existing TCP connection.  This is possible, but it requires a bit of
work. 

The technique is to use `tls.createSecurePair()`, which returns two streams: an encrypted stream and a cleartext stream. The encrypted stream is then piped to the socket, the cleartext stream is what the user interacts with thereafter.

[Here is a gist that does it.](http://gist.github.com/848444)

### Using NPN and SNI

NPN (Next Protocol Negotitation) and SNI (Server Name Indication) are TLS handshake extensions. 

NPN is to use one TLS server for multiple protocols (HTTP, SPDY)

SNI is to use one TLS server for multiple hostnames with different SSL certificates.

### Events

@event `'secure'`
@cb `function()`: The callback to execute once the event fires

The event is emitted from the SecurePair once the pair has successfully established a secure connection.

Similarly to the checking for the server `'secureConnection'` event, `pair.cleartext.authorized should be checked to confirm whether the certificate
used properly authorized.


#### Event: 'secureConnect'
@cb `function()`: The callback to execute once the event fires

This event is emitted after a new connection has been successfully handshaked. 
The listener will be called no matter if the server's certificate was
authorized or not. It is up to the user to test `cleartextStream.authorized`
to see if the server certificate was signed by one of the specified CAs.
If `cleartextStream.authorized === false` then the error can be found in
`cleartextStream.authorizationError`. Also if NPN was used - you can check
`cleartextStream.npnProtocol` for negotiated protocol.

#### Event: 'secureConnection'
@cb `function()`: The callback to execute once the event fires, `cleartextStream`: A boolean value indicating if the client has verified by one of the supplied certificate authorities for the server.

This event is emitted after a new connection has been successfully
handshaked. The argument is a instance of
[CleartextStream](#tls.CleartextStream). It has all the common stream methods
and events.

`cleartextStream.authorized` is  If `cleartextStream.authorized` is false, then
`cleartextStream.authorizationError` is set to describe how authorization
failed. Implied but worth mentioning: depending on the settings of the TLS
server, you unauthorized connections may be accepted.
`cleartextStream.npnProtocol` is a string containing selected NPN protocol.
`cleartextStream.servername` is a string containing servername requested with
SNI.

### TLS Methods

@method `tls.connect(port, [host=localhost], [options], [secureConnectListener])`
@param `port`: The port to connect to, `host`: An optional hostname to connect to; defaults to `localhost`, `options`: Any options you want to pass to the server, `secureConnectionListener`: An optional listener

Creates a new client connection to the given `port` and `host`. This function returns a [`CleartextStream`](#tls.CleartextStream) object.

`options` should be an object that specifies the following values:

  - `key`: A string or `Buffer` containing the private key of the client in aPEM format. The default is `null`.

  - `passphrase`: A string of a passphrase for the private key. The default is `null`.

  - `cert`: A string or `Buffer` containing the certificate key of the client in a PEM format; in other words, the public x509 certificate to use. The default is `null`.

  - `ca`: An array of strings or `Buffer`s of trusted certificates. These are used to authorize connections. If this is omitted, several "well-known root" CAs will be used, like VeriSign. 

  - `NPNProtocols`: An array of strings or a  `Buffer` containing supported NPN protocols. 
        `Buffer` should have the following format: `0x05hello0x05world`, where the preceding byte indicates the following protocol name's length. Passing an array is usually much simplier: `['hello', 'world']`. 
        Protocols should be ordered by their priority.

  - `servername`: The server name for the SNI (Server Name Indication) TLS extension.

`secureConnectionListener` automatically sets a listener for the
[secureConnection](#event_secureConnection_) event.


#### Example

Here's an example of a client connecting to an echo server:

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
    

@method `pair = tls.createSecurePair([credentials], [isServer], [requestCert], [rejectUnauthorized])`
@param `credentials`: An optional credentials object from `crypto.createCredentials( ... )`, `isServer`: An optional boolean indicating whether this TLS connection should be opened as a server (`true`) or a client (`false`), `requestCert`: A boolean indicating whether a server should request a certificate from a connecting client; only applies to server connections, `rejectUnauthorized`: A boolean indicating whether a server should automatically reject clients with invalid certificates; only applies to servers with `requestCert` enabled

Creates a new secure `pair` object with two streams, one of which reads/writes
encrypted data, and one reads/writes cleartext data. This function returns a SecurePair object with [cleartext](#tls.CleartextStream) and `encrypted` stream properties.

Generally, the encrypted one is piped to/from an incoming encrypted data stream,
and the cleartext one is used as a replacement for the initial encrypted stream.

@method `tls.createServer(options, [secureConnectionListener])`
@param `options`: Any options you want to pass to the server, `secureConnectionListener`: An optional listener

Creates a new [tls.Server](#tls.Server).

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

`secureConnectionListener` automatically sets a listener for the
[secureConnection](#event_secureConnection_) event.

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

You can test this server by connecting to it with `openssl s_client`:

    openssl s_client -connect 127.0.0.1:8000

 
## `tls.Server`

This class is a subclass of `net.Server` and has the same methods on it. Instead of accepting just raw TCP connections, it accepts encrypted connections using TLS or SSL.

### Methods

@method `server.addContext(hostname, credentials)`
@param `hostname`: The hostname to match, `credentials`: The credentials to use

Add secure context that will be used if client request's SNI hostname is
matching passed `hostname` (wildcards can be used). `credentials` can contain
`key`, `cert`, and `ca`.

@method `server.address()`

Returns the bound address and port of the server as reported by the operating
system. 

For more information, see [net.Server.address()](net.html#server.address).


@method `server.close()`

Stops the server from accepting new connections. This function is asynchronous, and the server is finally closed when it emits a `'close'` event.

@method `server.listen(port, [host], [callback()])`
@param `port`: The specific port to listen to, `host`: An optional host to listen to, `callback()`: An optional callback to execute when the server has been bound

Begin accepting connections on the specified `port` and `host`.  If the
`host` is omitted, the server will accept connections directed to any
IPv4 address (`INADDR_ANY`).

For more information, see `net.Server`.

### Properties

@prop `server.connections`

The number of concurrent connections on the server.

@prop `server.maxConnections`

Set this property to reject connections when the server's connection count gets high.

### Methods

@method `cleartextStream.address()`

Returns the bound address and port of the underlying socket as reported by the operating system. Returns an object with two properties, _e.g._ `{"address":"192.168.57.1", "port":62053}`

### Objects

@obj `tls.CleartextStream`

This is a stream on top of the `Encrypted` stream that makes it possible to read/write an encrypted data as a cleartext data.

This instance implements the duplex [Stream](streams.html#streams) interfaces. It has all the common stream methods and events.

### Properties 

@prop `cleartextStream.authorizationError`

The reason why the peer's certificate has not been verified. This property
becomes available only when `cleartextStream.authorized === false`.

@prop `cleartextStream.authorized`

A boolean that is `true` if the peer certificate was signed by one of the specified CAs; otherwise `false`

@prop `cleartextStream.getPeerCertificate()`

Returns an object representing the peer's certicicate. The returned object has some properties corresponding to the field of the certificate.

If the peer does not provide a certificate, it returns `null` or an empty object.

@prop `cleartextStream.remoteAddress`

The string representation of the remote IP address. For example, `'74.125.127.100'` or `'2001:4860:a005::68'`.

@prop `cleartextStream.remotePort`

The numeric representation of the remote port. For example, `443`.

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
      fingerprint: '2A:7A:C2:DD:E5:F9:CC:53:72:35:99:7A:02:5A:71:38:52:EC:8A:DF' }

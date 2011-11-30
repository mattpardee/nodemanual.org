## net

The `net` module provides you with an asynchronous network wrapper. It contains methods for creating both servers and clients (called streams). You can include this module in your code with `require('net');`

### Methods

@method `net.createServer([options = {allowHalfOpen: false}], [connectionListener])`
@param `options`: An object with any options you want to include, `connectionListener`: Automatically set as a listener for the ['connection'](#event_connection_) event

Creates a new TCP server. 

If `allowHalfOpen` is `true`, then the socket won't automatically send FIN packet when the other end of the socket sends a FIN packet. The socket becomes non-readable, but still writable. You should call the `end()` method explicitly. See ['end'](#event_end_) event for more information.

#### Example

Here is an example of a echo server which listens for connections on port 8124:

    var net = require('net');
    var server = net.createServer(function(c) { //'connection' listener
      console.log('server connected');
      c.on('end', function() {
        console.log('server disconnected');
      });
      c.write('hello\r\n');
      c.pipe(c);
    });
    server.listen(8124, function() { //'listening' listener
      console.log('server bound');
    });

You can test this by using `telnet`:

    telnet localhost 8124

To listen on the socket `/tmp/echo.sock` the third line from the last would just be changed to

    server.listen('/tmp/echo.sock', function() { //'listening' listener

You can use `nc` to connect to a UNIX domain socket server:

    nc -U /tmp/echo.sock

@method `net.connect(port, [host='localhost'], [connectListener])` / `net.createConnection(port, [host='localhost'], [connectListener])`
@param `port`: The port to connect to, `host`: The name of the host to connect to, `connectionListener`: Automatically set as a listener for the ['connection'](#event_connection_) event

Construct a new socket object and opens a socket to the given location. When the socket is established, the ['connect'](#event_connect_) event is emitted.

The arguments for these methods change the type of connection. For example, if you include `host`:

* `net.connect(port, [host], [connectListener])`
* `net.createConnection(port, [host], [connectListener])`

  You create a TCP connection to `port` on `host`.
  
  If you don't include it:

* `net.connect(path, [connectListener])`
* `net.createConnection(path, [connectListener])`

  You create a unix socket connection to `path`.


### Example

Here's an example of a client connecting to an echo server:

    var net = require('net');
    var client = net.connect(8124, function() { //'connect' listener
      console.log('client connected');
      client.write('world!\r\n');
    });
    client.on('data', function(data) {
      console.log(data.toString());
      client.end();
    });
    client.on('end', function() {
      console.log('client disconnected');
    });

To connect on the socket `/tmp/echo.sock`, the second line becomes:

    var client = net.connect('/tmp/echo.sock', function() { //'connect' listener

---

### Objects

@obj net.Server

This class is used to create a TCP or UNIX server. A server is a `net.Socket` that can listen for new incoming connections.

### Events

@event `'listening'`
@cb `function ()`: The callback to execute once the event fires

Emitted when the server has been bound after calling `server.listen`.

@event `'connection'`
@cb `function (socket)`: The callback to execute once the event fires; `socket` is an instance of `net.Socket`.

Emitted when a new connection is made.

@event `'close'`
@cb `function ()`: The callback to execute once the event fires

Emitted when the server closes.

@event `'error'`
@cb `function (exception)`: The callback to execute once the event fires; `exception` is any exception encountered

Emitted when an error occurs.  The `'close'` event is called directly following this event.  See an example in the discussion of `server.listen`.

### Methods

@method `server.listen(port, [host], [listeningListener])`
@param `port`: The port to connect to, `host`: The name of the host to connect to, `listeningListener`: Automatically set as a listener for the ['listening'](#event_listening_) event

Begin accepting connections on the specified `port` and `host`.  If the `host` is omitted, the server accepts connections directed to any IPv4 address (`INADDR_ANY`). A port value of zero will assign a random port.

This function is asynchronous.  When the server has been bound, the ['listening'](#event_listening_) event is emitted.

One issue some users run into is getting `EADDRINUSE` errors. This means that another server is already running on the requested port. One way of handling this would be to wait a second and then try again. This can be done with

    server.on('error', function (e) {
      if (e.code == 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(function () {
          server.close();
          server.listen(PORT, HOST);
        }, 1000);
      }
    });

**Note**: All sockets in Node.js set `SO_REUSEADDR` already.

@method `server.listen(path, [listeningListener])`
@param `port`: The port to connect to, `listeningListener`: Automatically set as a listener for the ['listening'](#event_listening_) event

Start a UNIX socket server listening for connections on the given `path`. This function is asynchronous.

@method `server.pause(msecs=1000)`
@param `msecs`: The number of milliseconds to pause for

Stop accepting connections for the given number of milliseconds. This could be useful for throttling new connections against DoS attacks or other oversubscriptions.

@method `server.close()`

Stops the server from accepting new connections. This function is asynchronous, and  the server is finally closed when it emits a `'close'` event.


@method `server.address()`

Returns the bound address and port of the server as reported by the operating system. Useful to find which port was assigned when giving getting an OS-assigned address. 

This returns an object with two properties, like this:

    {"address":"127.0.0.1", "port":2121}`

#### Example

    var server = net.createServer(function (socket) {
      socket.end("goodbye\n");
    });

    // grab a random port
    server.listen(function() {
      address = server.address();
      console.log("opened server on %j", address);
    });


### Properties
@prop `server.maxConnections`

Set this property to reject connections when the server's connection count gets high.

@prop `server.connections`

The number of concurrent connections on the server.

`net.Server` is an `EventEmitter` with the following events:


### Objects

@obj `net.Socket`

This object is an abstraction of a TCP or UNIX socket. `net.Socket` instances implement a duplex Stream interface.  They can be created by the user and used as a client (with `connect()`) or they can be created by Node.js and passed to the user through the `'connection'` event of a server.

@method `new net.Socket([options])`
@param `options`: An object of options you can pass

Constructs a new socket object.

`options` is an object with the following defaults:

    { fd: null
      type: null
      allowHalfOpen: false
    }

where

* `fd` allows you to specify the existing file descriptor of socket. 
* `type` specifies the underlying protocol. 
    It can be `'tcp4'`, `'tcp6'`, or `'unix'`.
* For `allowHalfOpen`, refer to `createServer()` and the `'end'` event.

@method `socket.connect(port, [host=localhost], [connectListener])` / `socket.connect(path, [connectListener])`
@param `port`: The port to connect to, `host`: The name of the host to connect to, `connectionListener`: Automatically set as a listener for the ['connection'](#event_connection_) event

Opens the connection for a given socket. If `port` and `host` are given, then the socket is opened as a TCP socket. If a `path` is given, the socket is opened as a unix socket to that path.

Normally this method isn't needed, as `net.createConnection()` opens the socket. Use this only if you are implementing a custom Socket or if a Socket is closed and you want to reuse it to connect to another server.

This function is asynchronous. When the ['connect'](#event_connect_) event is emitted the socket is established. If there is a problem connecting, the `'connect'` event will not be emitted, the `'error'` event will be emitted with the exception.

@prop `socket.bufferSize`

`net.Socket` has the property that `socket.write()` always works. This is to help users get up and running quickly. The computer cannot always keep up with the amount of data that is written to a socket&mdash;the network connection simply might be too slow. Node.js will internally queue up the data written to a socket and send it out over the wire whenever it's possible. (Internally, it's polling on the socket's file descriptor for being writable.)

The consequence of this internal buffering is that memory may grow. This property shows the number of characters currently buffered to be written.  The Number of characters is approximately equal to the number of bytes to be written, but the buffer may contain strings, and the strings are lazily encoded, so the _exact_ number of bytes is not known.

**Note**: Users who experience a large or growing `bufferSize` should attempt to "throttle" the data flows in their program with `pause()` and `resume()`.

@method `socket.setEncoding(encoding=null)`
@param `encoding`: The encoding to use (either `'ascii'`, `'utf8'`, or `'base64'`)

Sets the encoding for data that is received.

@method `socket.setSecure()`

This function has been removed in Node.js v0.3. It was used to upgrade the connection to SSL/TLS. See the [TLS section](tls.html#tLS_) for the new API.

@method `socket.write(data, [encoding='utf8'], [callback()])`
@param `data`: The data to write, `enocding`: The encoding to use, `[callback()]`: The callback to execute once the write is finished

Sends data on the socket. The second parameter specifies the encoding in the case of a string&mdash;it defaults to UTF8 encoding.

Returns `true` if the entire data was flushed successfully to the kernel buffer. Returns `false` if all or part of the data was queued in user memory. `'drain'` is emitted when the buffer is again free.

@method `socket.end([data], [encoding])`
@param `[data]`: The data to write first, `[encoding]`: The encoding to use

Half-closes the socket. _i.e._, it sends a FIN packet. It is possible the server can still send some data.

If `data` is specified, it's equivalent to calling `socket.write(data, encoding)` followed by `socket.end()`.

@method `socket.destroy()`

Ensures that no more I/O activity happens on this socket. Only necessary in case of errors (parse error or so).

@method `socket.pause()`

Pauses the reading of data. That is, `'data'` events are no longer emitted. Useful to throttle back an upload.

@method `socket.resume()`

Resumes reading after a call to `pause()`.

@method `socket.setTimeout(timeout, [callback()])`
@param `timeout`: The timeout length (in milliseconds), `callback()`: The function to execute as a one time listener for the `'timeout'` event.

Sets the socket to timeout after `timeout` milliseconds of inactivity on
the socket. By default `net.Socket` don't have a timeout.

When an idle timeout is triggered the socket will receive a `'timeout'` event but the connection will not be severed. The user must manually `end()` or `destroy()` the socket.

If `timeout` is 0, then the existing idle timeout is disabled.

@method `socket.setNoDelay(noDelay=true)`
@param `noDelay`: If `true`, immediately fires off data each time `socket.write()` is called.

Disables the Nagle algorithm. By default TCP connections use the Nagle algorithm, they buffer data before sending it off. 

@method `socket.setKeepAlive(enable=false, [initialDelay])`
@param `enable`: Enables or disables whether to stay alive, `[initialDelay]`: The delay (in milliseconds) between the last data packet received and the first keepalive probe

Enable and disable keep-alive functionality, and optionally set the initial delay before the first keepalive probe is sent on an idle socket.

Setting `initialDelay` to 0 for leaves the value unchanged from the default (or previous) setting.

@method `socket.address()`

Returns the bound address and port of the socket as reported by the operating system. Returns an object with two properties that looks like this:
    `{"address":"192.168.57.1", "port":62053}`

@prop `socket.remoteAddress`

The string representation of the remote IP address. For example, `'74.125.127.100'` or `'2001:4860:a005::68'`.

@prop `socket.remotePort`

The numeric representation of the remote port. For example, `80` or `21`.

@prop `socket.bytesRead`

The amount of received bytes.

@prop `socket.bytesWritten`

The amount of bytes sent.

`net.Socket` instances are EventEmitters with the following events:

### Events

@event `'connect'`
@cb `function()`: The callback to execute once the event fires

Emitted when a socket connection is successfully established. For more information, see `connect()`.

@data `'data'`
@cb `function(data)`: The callback to execute once the event fires, `data`: A `Buffer` or `String`, depending on what it is

Emitted when data is received. The encoding of `data` is set by `socket.setEncoding()`.

For more information, see the [Readable Stream](streams.html#readable_Stream) section for more information.

@event `'end'`
@cb `function()`: The callback to execute once the event fires

Emitted when the other end of the socket sends a FIN packet.

By default (`allowHalfOpen == false`), the socket destroys its file descriptor  once it has written out its pending write queue. However, by setting `allowHalfOpen == true` the socket will not automatically `end()` its side, allowing the user to write arbitrary amounts of data, with the caveat that the user is required to `end()` their side now.

@event `'timeout'`
@cb `function()`: The callback to execute once the event fires

Emitted if the socket times out from inactivity. This is only to notify that the socket has been idle. The user must manually close the connection.

See also: `socket.setTimeout()`


@event `'drain'`
@cb `function()`: The callback to execute once the event fires

Emitted when the write buffer becomes empty. Can be used to throttle uploads.

See also: the return values of `socket.write()`

@event `'error'`
@cb `function(exception)`: The callback to execute once the event fires, `exception`: Any exceptions encountered

Emitted when an error occurs.  The `'close'` event is called directly following this event.

@event `'close'`
@cb `function(had_error)`: The callback to execute once the event fires, `had_error`: A `true` boolean if the socket was closed due to a transmission error

Emitted once the socket is fully closed.

@obj net.isIP

@method `net.isIP(input)`
@param `input`: The data to check against

Tests if `input` is an IP address. Returns `0` for invalid strings, returns `4` for IP version 4 addresses, and returns `6` for IP version 6 addresses.

@method `net.isIPv4(input)`
@param `input`: The data to check against

Returns `true` if input is a version 4 IP address.

@method `net.isIPv6(input)`
@param `input`: The data to check against

Returns `true` if input is a version 6 IP address.
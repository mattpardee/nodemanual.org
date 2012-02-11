/**
class net

The `net` module provides you with an asynchronous network wrapper. It contains methods for creating both servers and clients (called streams). You can include this module in your code with `require('net');`


#### Example

Here is an example of a echo server which listens for connections on port 8124:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/net/net.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

You can test this by using `telnet`:

    telnet localhost 8124

To listen on the socket `/tmp/echo.sock` the third line from the last would just be changed to

    server.listen('/tmp/echo.sock', function() { //'listening' listener

You can use `nc` to connect to a UNIX domain socket server:

    nc -U /tmp/echo.sock
**/


/** alias of: createConnection
net.connect(port, [host='localhost'] [, connectionListener()]) -> Void
net.connect(port [,connectionListener()]) -> Void
- port (Number): The port to connect to
- host (String): The name of the host to connect to
- connectionListener (Function): Automatically set as a listener for the [[net.Server@connection `'connection'`]] event

Construct a new socket object and opens a socket to the given location. When the socket is established, the `'connect'` event is emitted.

The arguments for these methods change the type of connection. For example, if you include `host`, you create a TCP connection to `port` on `host`. If you don't include it, you create a unix socket connection to `path`.

**/ 

/**
net.createConnection(port, [host='localhost'] [, connectionListener()]) -> Void
net.createConnection(port, [,connectionListener()]) -> Void
- port (Number): The port to connect to
- host (String): The name of the host to connect to
- connectionListener (Function): Automatically set as a listener for the [[net.Server@connection `'connection'`]] event

Construct a new socket object and opens a socket to the given location. When the socket is established, the `'connect'` event is emitted.

The arguments for these methods change the type of connection. For example, if you include `host`, you create a TCP connection to `port` on `host`. If you don't include it, you create a unix socket connection to `path`.

**/

/**
net.isIP(input) -> String
- input (String): The data to check against

Tests if `input` is an IP address. Returns `0` for invalid strings, returns `4` for IP version 4 addresses, and returns `6` for IP version 6 addresses.


**/ 


/**
net.isIPv4(input) -> String
- input (String): The data to check against

Returns `true` if input is a version 4 IP address.

**/ 


/**
net.isIPv6(input) -> String
- input (String): The data to check against

Returns `true` if input is a version 6 IP address. 

**/ 

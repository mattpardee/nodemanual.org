## UDP and Datagram Sockets

Datagram sockets are available by adding `require('dgram')` to your code.

#### A Note About UDP Datagram Size

The maximum size of an `IPv4/v6` datagram depends on the `MTU` (_Maximum Transmission Unit_) and on the `Payload Length` field size.

The `Payload Length` field is `16 bits` wide, which means that a normal payload can't be larger than 64K octets, including internet header and data: (65,507 bytes = 65,535 − 8 bytes UDP header − 20 bytes IP header). This is generally true for loopback interfaces, but such long datagrams are impractical for most hosts and networks.

The `MTU` is the largest size a given link layer technology can support for datagrams. For any link, IPv4 mandates a minimum `MTU` of `68` octets, while the recommended `MTU` for IPv4 is `576` (typically recommended as the `MTU` for dial-up type applications), whether they arrive whole or in fragments.

For `IPv6`, the minimum `MTU` is `1280` octets; however, the mandatory minimum fragment reassembly buffer size is `1500` octets. The value of `68` octets is very small, since most current link layer technologies have a minimum `MTU` of `1500` (like Ethernet).

**Note**: it's impossible to know in advance the MTU of each link through which a packet might travel, and that generally sending a datagram greater than the (receiver) `MTU` won't work (the packet gets silently dropped, without informing the source that the data did not reach its intended recipient).

### Events
@event `'message'`
@cb `function (msg, rinfo)`: The callback to execute once the event fires, `msg`: A `Buffer`, `rinfo`: An object with the sender's address information and the number of bytes in the datagram. 

Emitted when a new datagram is available on a socket. 

@event `'listening'`
@cb `function ()`: The callback to execute once the event fires

Emitted when a socket starts listening for datagrams. This happens as soon as UDP sockets are created.

@event `'close'`
@cb `function ()`: The callback to execute once the event fires

Emitted when a socket is closed with `close()`.  No new `message` events are emitted on this socket.

@event `'error'`
@cb `function (exception)`: The callback to execute once the event fires, `exception`: The error that was encountered

Emitted when an error occurs.

@method `dgram.createSocket(type, [callback()])`
@param `type`: The type of socket to create; valid types are `udp4`
and `udp6`, `[callback()]`: A callback that's added as a listener for `message` events

Creates a datagram socket of the specified types.

If you want to receive datagrams, call `socket.bind()`. `socket.bind()` binds to the "all interfaces" address on a random port (it does the right thing for both `udp4` and `udp6` sockets). You can then retrieve the address and port with `socket.address().address` and `socket.address().port`.

@method `dgram.send(buf, offset, length, port, address, [callback(err)])`
@param `buf`: The data buffer to send, `offset`: Indicates where in the buffer to start at, `length`: Indicates how much of the buffer to use, `port`: The port to send to, `address`: The address to send to, `[callback(err)]`: The callback to execute once the method completes, that may be used to detect any DNS errors and when `buf` may be reused

Sends some information to a specified `address:port`. For UDP sockets, the destination port and IP address must be specified.  

A string may be supplied for the `address` parameter, and it will be resolved with DNS. Note that DNS lookups delay the time that a send takes place, at least until the next tick.  The only way to know for sure that a send has taken place
is to use the callback.

If the socket has not been previously bound with a call to `bind`, it's assigned a random port number and bound to the "all interfaces" address (0.0.0.0 for `udp4` sockets, ::0 for `udp6` sockets).

#### Example

Sending a UDP packet to a random port on `localhost`;

    var dgram = require('dgram');
    var message = new Buffer("Some bytes");
    var client = dgram.createSocket("udp4");
    client.send(message, 0, message.length, 41234, "localhost", function(err, bytes) {
      client.close();
    });

@method `dgram.bind(port, [address])`
@param `port`: The port to bind to, `address`: The address to attach to

For UDP sockets, listen for datagrams on a named `port` and optional `address`. If `address` isn't specified, the OS tries to listen on all addresses.

#### Example

Example of a UDP server listening on port 41234:

    var dgram = require("dgram");

    var server = dgram.createSocket("udp4");

    server.on("message", function (msg, rinfo) {
      console.log("server got: " + msg + " from " +
        rinfo.address + ":" + rinfo.port);
    });

    server.on("listening", function () {
      var address = server.address();
      console.log("server listening " +
          address.address + ":" + address.port);
    });

    server.bind(41234);
    // server listening 0.0.0.0:41234


@method `dgram.close()`

Close the underlying socket and stop listening for data on it.

@method `dgram.address()`

Returns an object containing the address information for a socket.  For UDP sockets, this object contains `address` and `port`.

@method `dgram.setBroadcast(flag)`
@param `flag`: The value of `SO_BROADCAST`

Sets or clears the `SO_BROADCAST` socket option.  When this option is set, UDP packets may be sent to a local interface's broadcast address.

@method `dgram.setTTL(ttl)`
@param `ttl`: The value of `IP_TTL`

Sets the `IP_TTL` socket option. TTL stands for "Time to Live," but in this context it specifies the number of IP hops that a packet is allowed to go through. Each router or gateway that forwards a packet decrements the TTL.  If the TTL is decremented to 0 by a router, it will not be forwarded.  Changing TTL values is typically done for network probes or when multicasting.

The argument to `setTTL()` is a number of hops between 1 and 255.  The default on most systems is 64.

@method `dgram.setMulticastTTL(ttl)`
@param `ttl`: The value of `IP_MULTICAST_TTL`

Sets the `IP_MULTICAST_TTL` socket option.  TTL stands for "Time to Live," but in this context it specifies the number of IP hops that a packet is allowed to go through, specifically for multicast traffic.  Each router or gateway that forwards a packet decrements the TTL. If the TTL is decremented to 0 by a router, it will not be forwarded.

The argument to `setMulticastTTL()` is a number of hops between 0 and 255.  The default on most systems is 64.

@method `dgram.setMulticastLoopback(flag)`
@param `flag`: The value of `IP_MULTICAST_LOOP`

Sets or clears the `IP_MULTICAST_LOOP` socket option.  When this option is set, multicast packets will also be received on the local interface.

@method `dgram.addMembership(multicastAddress, [multicastInterface])`
@param `multicastAddress`: The address to add, `[multicastInterface]`: The interface to use

Tells the kernel to join a multicast group with the `IP_ADD_MEMBERSHIP` socket option.

If `multicastInterface` is not specified, the OS will try to add membership to all valid interfaces.

@method `dgram.dropMembership(multicastAddress, [multicastInterface])`
@param `multicastAddress`: The address to drop, `[multicastInterface]`: The interface to use

Opposite of `addMembership`&mdash;this tells the kernel to leave a multicast group with `IP_DROP_MEMBERSHIP` socket option. This is automatically called by the kernel when the socket is closed or process terminates, so most apps will never need to call this.

If `multicastInterface` is not specified, the OS will try to drop membership to all valid interfaces.

## Streams

A stream is an abstract interface implemented by various objects in Node.js. For example a request to an HTTP server is a stream, as is stdout. Streams are readable, writable, or both. All streams are instances of `EventEmitter`.

### Readable Stream

A `Readable Stream` has the following methods, members, and events:

#### Events

@event `close`
@cb `function()`: The callback to execute once the event fires

Emitted when the underlying file descriptor has been closed. Not all streams emit this.  For example, an incoming HTTP request don't emit
`close`.

@event `data`
@cb `function(data)`: The callback to execute once the event fires, `data` : The data being emitted

The `data` event emits either a `Buffer` (by default) or a string if
`setEncoding()` was previously used on the stream.

@event `end`
@cb `function()`: The callback to execute once the event fires

Emitted when the stream has received an EOF (FIN in TCP terminology). Indicates that no more `data` events will happen. If the stream is also writable, it may be possible to continue writing.

@event `error`
@cb `function()`: The callback to execute once the event fires

Emitted if there was an error receiving data.


### Methods 

@method `stream.destroy()`

Closes the underlying file descriptor. Stream will not emit any more events.

@method `stream.destroySoon()`

After the write queue is drained, close the file descriptor.

@method `stream.pause()`

Pauses the incoming `'data'` events.

@method `stream.pipe(destination, [options])`
@param `destination`: The WriteStream to connect to, `[options]`: Any optional commands to send

This is the `Stream.prototype()` method available on all `Stream` objects. It connects this read stream to a `destination`. Incoming data on this stream is written to `destination`. The destination and source streams are kept in sync by Node.js pausing and resuming as necessary.

This function returns the `destination` stream.

By default, `end()` is called on the destination when the source stream emits `end`, so that `destination` is no longer writable. Pass `{ end: false }` as `options` to keep the destination stream open.

#### Example 

Emulating the Unix `cat` command:

    process.stdin.resume();
    process.stdin.pipe(process.stdout);

This keeps `process.stdout` open so that "Goodbye" can be written at the end.

    process.stdin.resume();

    process.stdin.pipe(process.stdout, { end: false });

    process.stdin.on("end", function() {
      process.stdout.write("Goodbye\n");
    });
    
@method `stream.readable()`

A boolean that is `true` by default, but turns `false` after an `error` event
occurrs, the stream comes to an `'end'`, or if `destroy()` was called.

@method `stream.setEncoding(encoding)`
@param `encoding`: The encoding to use

Makes the `data` event emit a string instead of a `Buffer`. `encoding` can be
`'utf8'`, `'ascii'`, or `'base64'`.

@method `stream.resume()`

Resumes the incoming `'data'` events after a `pause()`.


## Writable Stream

A `Writable Stream` has the following methods, members, and events:

### Events


@event `close`
@cb `function()`: The callback to execute once the event fires

Emitted when the underlying file descriptor has been closed.

@event `drain`
@cb `function()`: The callback to execute once the event fires

After a `write()` method returns `false`, this event is emitted to indicate that it is safe to write again.

@event `error`
@cb `function(exception)`: The callback to execute once the event fires, `exception`: The exception that was received

Emitted when there's an error with the exception `exception`.

@event `pipe`
@cb `function(src)`: The callback to execute once the event fires, `src`: The readable stream

Emitted when the stream is passed to a readable stream's pipe method.

### Methods

@method `stream.destroy()`

Closes the underlying file descriptor. The stream doesn't emit any more events. Any queued write data is not sent.

@method `stream.destroySoon()`

After the write queue is drained, this closes the file descriptor. `destroySoon()` can still destroy straight away, as long as there is no data left in the queue for writes.

@method `stream.end()`

Terminates the stream with EOF or FIN. This call send queued write data before closing the stream.

@method `stream.end(string, encoding)`
@param `string`: The message to send, `encoding`: The encoding to use

Sends `string` with the given `encoding` and terminates the stream with EOF
or FIN. This is useful to reduce the number of packets sent.

@method `stream.end(buffer)`
@param `buffer`: The buffer to send

Same as above, but using a `buffer` object instead.

@method `stream.writable()`

A boolean that is `true` by default, but turns `false` after an `'error'`
occurrs,  or if `end()` or `destroy()` were called.

@method `stream.write(string, encoding='utf8', [fd])`
@param `string`: The string to write, `encoding`: The encoding to use; defaults to `utf8`, `[fd]`: An optional file descriptor to pass

Writes `string` with the given `encoding` to the stream.  Returns `true` if
the string has been flushed to the kernel buffer.  Returns `false` to
indicate that the kernel buffer is full, and the data will be sent out in
the future. The `drain` event indicates when the kernel buffer is
empty again.

If `fd` is specified, it is interpreted as an integral file descriptor to be sent over the stream. This is only supported for UNIX streams, and is ignored otherwise. When writing a file descriptor in this manner, closing the descripton before the stream drains risks sending an invalid (closed) FD.

@method `stream.write(buffer)`
@param `buffer`: The buffer to write to

Same as above, except using a raw buffer.

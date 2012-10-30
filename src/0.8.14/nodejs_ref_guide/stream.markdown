## stream
({"type": "global"})

> Stability: 2 - Unstable

A stream is an abstract interface implemented by various objects in Node.js. For
example, a request to an HTTP server is a stream, as is stdout. Streams are
readable, writable, or both. All streams are instances of [[eventemitter `EventEmitter`]].

For more information, see [this article on understanding
streams](../nodejs_dev_guide/understanding_streams.html).

#### Example: Printing to the console
	
<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/streams/streams.1.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

#### Example: Reading from the console

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/streams/streams.2.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

## stream.ReadableStream



### stream.ReadableStream@close()

Emitted when the underlying resource (for example, the backing file descriptor)
has been closed. Not all streams emit this.

 


### stream.ReadableStream@data(data)
- data {Buffer | String}   The data being emitted

The `data` event emits either a `Buffer` (by default) or a string if
`setEncoding()` was previously used on the stream.

 


### stream.ReadableStream@end()

Emitted when the stream has received an EOF (FIN in TCP terminology). Indicates
that no more `data` events will happen. If the stream is also writable, it may
be possible to continue writing.

 


### stream.ReadableStream@error()

Emitted if there was an error receiving data.
 


### stream.ReadableStream@pipe(src)
- src {stream.ReadableStream}  The readable stream

Emitted when the stream is passed to a readable stream's pipe method.

 


### stream.ReadableStream.destroy()

Closes the underlying file descriptor. 

The stream is no longer `writable` nor `readable`.  The stream will not emit 
any more 'data', or 'end' events. Any queued write data will not be sent.  

The stream should emit the 'close' event once its resources have been disposed of.

### stream.ReadableStream.pause()

Issues an advisory signal to the underlying communication layer, requesting
that no further data be sent until `resume()` is called.

Note that, due to the advisory nature, certain streams will not be paused
immediately, and so `'data'` events may be emitted for some indeterminate
period of time even after `pause()` is called. You may wish to buffer such
`'data'` events.



### stream.ReadableStream.pipe(destination [, options]), stream
- destination {stream.WritableStream}   The WriteStream to connect to
- options {Object}   Any optional commands to send

This is the `Stream.prototype()` method available on all `Stream` objects. It
connects this read stream to a `destination`. Incoming data on this stream is
then written to `destination`. The destination and source streams are kept in
sync by Node.js pausing and resuming as necessary.

This function returns the `destination` stream.

By default, `end()` is called on the destination when the source stream emits
`end`, so that `destination` is no longer writable. Pass `{ end: false }` into
`options` to keep the destination stream open.

#### Example 

Emulating the Unix `cat` command:

    process.stdin.resume(); // process.stdin is paused by default, so we need to
start it up
    process.stdin.pipe(process.stdout); // type something into the console &
watch it repeat

This keeps `process.stdout` open so that "Goodbye" can be written at the end.

    process.stdin.resume();

    process.stdin.pipe(process.stdout, { end: false });

    process.stdin.on("end", function() {
      process.stdout.write("Goodbye\n");
    });

 
 

### stream.ReadableStream.setEncoding([encoding='utf8'])
- encoding {String}  The encoding to use; this can be `'utf8'`, 
`'utf16le'` (`'ucs2'`), `'ascii'`, or `'hex'`

Makes the [[stream.ReadableStream@data `'data'`]] event emit a string instead of a `Buffer`.

 


### stream.ReadableStream.resume()

Resumes the incoming `'data'` events after a `pause()`. 

 

## stream.WritableStream

 

### stream.WritableStream.writable, Boolean

A boolean that is `true` by default, but turns `false` after an `error` event
occurs, the stream comes to an `'end'`, or if `destroy()` was called.



### stream.WritableStream@close()


Emitted when the underlying file descriptor has been closed.

 



### stream.WritableStream@drain()

Emitted when the stream's write queue empties and it's safe to write without
buffering again. Listen for it when `stream.write()` returns `false`.

The `'drain'` event can happen at **any time**, regardless of whether or not
`stream.write()` has previously returned `false`. To avoid receiving unwanted
`'drain'` events, listen using `stream.once()`.

 


### stream.WritableStream@error(exception)
- exception {Error}  The exception that was received

Emitted when there's an error with the exception `exception`.

 


### stream.WritableStream.destroy()

Closes the underlying file descriptor. The stream doesn't emit any more events.
Any queued write data is not sent.




### stream.WritableStream.destroySoon()

After the write queue is drained, this closes the file descriptor.

`destroySoon()` can still destroy straight away, as long as there is no data
left in the queue for writes.


 

### stream.WritableStream.end()
### stream.WritableStream.end(string, encoding)
### stream.WritableStream.end(buffer)
- string {String}  The message to send
- encoding {String}  The encoding to use
- buffer {Buffer}   The buffer to send

Terminates the stream with EOF or FIN. This call send queued write data before
closing the stream.

For `stream.WritableStream.end(string, encoding)`, a `string` with the given
`encoding` is sent. This is useful to reduce the number of packets sent.

For `stream.WritableStream.end(Buffer)`, a `buffer` is sent.




### stream.WritableStream.write(string, [encoding='utf8'])
### stream.WritableStream.write(buffer)
- string {String}   The string to write
- encoding {String}   The encoding to use; defaults to `utf8`
- fd {Number}   An optional file descriptor to pass
- buffer {Buffer}  The buffer to write to

Writes `string` with the given `encoding` to the stream, or write `buffer`. 
Returns `true` if the string has been flushed to the kernel buffer.  Returns
`false` to indicate that the kernel buffer is full, and the data will be sent
out in the future. The `drain` event indicates when the kernel buffer is empty
again.

 



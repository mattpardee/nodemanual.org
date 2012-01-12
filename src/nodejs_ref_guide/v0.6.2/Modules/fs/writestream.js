/**
 * class fs.WriteStream
 *
 * This is a [[streams.WritableStream WritableStream]].
 * 
**/ 

/**
 * fs.WriteStream@open(fd) -> Void
 * - fd (Number):  The file descriptor used by the `WriteStream`
 * 
 * Emitted when a file is opened for writing.
 * 
**/ 


/**
 * fs.WriteStream.bytesWritten -> Number
 *
 * The number of bytes written so far. This doesn't include data that is still queued for writing.
**/


/**
 * fs.WriteStream.createWriteStream(path, [options]) -> streams.WritableStream
 * - path (String): The path to read from
 * - options (Object):  Any optional arguments indicating how to write the stream
 * 
 * Returns a new [[streams.WriteStream WriteStream]] object.
 * 
 * `options` is an object with the following defaults:
 * 
 *     { flags: 'w',
 *       encoding: null,
 *       mode: 0666 }
 * 
 * `options` may also include a `start` option to allow writing data at some position past the beginning of the file.  
 * 
 * Modifying a file rather than replacing it may require a `flags` mode of `r+` rather than the default mode `w`.
 * 
**/
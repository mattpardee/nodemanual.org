/**
 * class fs.ReadStream
 *
 * This is a [Readable Stream](streams.html#readable_Stream).
 * 
**/ 

/**
 * fs.ReadStream@open(fd) -> Void
 * - fd (Number):  The file descriptor used by the `ReadStream`
 *
 * Emitted when a file is opened.
 * 
**/ 


/**
 * fs.ReadStream.createReadStream(path, [options]) -> Void
 * - path (String): The path to read from
 * - options (Object): Any optional arguments indicating how to read the stream
 * 
 *
 * Returns a new [ReadStream](#readstream) object.
 * 
 * `options` is an object with the following defaults:
 * 
 *     { 
 *	     flags: 'r',
 *       encoding: null,
 *       fd: null,
 *       mode: 0666,
 *       bufferSize: 64 * 1024
 *     }
 * 
 * `options` can include `start` and `end` values to read a range of bytes from the file instead of the entire file.  Both `start` and `end` are inclusive and start at 0.
 * 
 * #### Example
 * 
 * Here's an example to read the last 10 bytes of a file which is 100 bytes long:
 * 
 *     fs.createReadStream('sample.txt', {start: 90, end: 99});
 * 
**/ 
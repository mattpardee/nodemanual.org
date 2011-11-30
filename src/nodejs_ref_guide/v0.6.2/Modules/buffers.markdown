## Buffers

Pure Javascript is Unicode friendly but not nice to binary data.  When dealing with TCP streams or the file system, it's necessary to handle octet streams. Node.js has several strategies for manipulating, creating, and consuming octet streams.

Raw data is stored in instances of the `Buffer` class. A `Buffer` is similar to an array of integers but corresponds to a raw memory allocation outside the V8 heap. A `Buffer` cannot be resized.

The `Buffer` object is global.

Converting between Buffers and Javascript string objects requires an explicit encoding method.  Here are the different string encodings;

* `'ascii'`: for 7-bit ASCII data only. This encoding method is very fast, and strips the high bit if set.
Note that this encoding converts a `null` character (`'\0'` or `'\u0000'`) into
`0x20` (character code of a space). If you want to convert a `null` character
into `0x00`, you should use the `'utf8'` encoding.

* `'utf8'`: multi byte encoded Unicode characters.  Many web pages and other document formats use UTF-8. 

* `'ucs2'`: 2-bytes, little endian encoded Unicode characters. It can encode
only BMP (Basic Multilingual Plane&mdash;from U+0000 to U+FFFF).

* `'base64'`: Base64 string encoding

* `'binary'`: A way of encoding raw binary data into strings by using only the first 8 bits of each character. This encoding method is deprecated and should be avoided in favor of `Buffer` objects where possible. This encoding is going to be removed in future versions of Node.js.

* `'hex'`: Encodes each byte as two hexidecimal characters.

### Constructors

@method `new Buffer(array)`
@param `array`: An array of octets to allocate

Allocates a new buffer using an `array` of octets.

@method `new Buffer(size)`
@param `size`: The size to allocate

Allocates a new buffer of `size` octets.

@method `new Buffer(str, encoding='utf8')`
@param `str`: The string to contain, `encoding`: The encoding to use; defaults to `utf8`

Allocates a new buffer containing the given `str`.

### Methods

@method `Buffer.byteLength(string, encoding='utf8')`
@param `string`: The string to check, `encoding`: The encoding to use; defaults to `utf8`

Gives the actual byte length of a string.  This is not the same as
`String.prototype.length` since that returns the number of *characters* in a
string.

#### Example

    str = '\u00bd + \u00bc = \u00be';

    console.log(str + ": " + str.length + " characters, " +
      Buffer.byteLength(str, 'utf8') + " bytes");

    // ½ + ¼ = ¾: 9 characters, 12 bytes
 
@method `buffer.copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)`
@param `targetBuffer`: The buffer to copy into, `targetStart`: The offset to start at for the buffer you're copying into, `sourceStart`: The offset to start at for the buffer you're copying from, `sourceEnd`: The number of bytes to read from the originating bugger; defaults to the length of the buffer

Performs a copy between buffers. The source and target regions can overlap.

#### Example

Building two Buffers, then copy `buf1` from byte 16 through byte 19
into `buf2`, starting at the 8th byte in `buf2`:

    buf1 = new Buffer(26);
    buf2 = new Buffer(26);

    for (var i = 0 ; i < 26 ; i++) {
      buf1[i] = i + 97; // 97 is ASCII a
      buf2[i] = 33; // ASCII !
    }

    buf1.copy(buf2, 8, 16, 20);
    console.log(buf2.toString('ascii', 0, 25));

    // prints !!!!!!!!qrst!!!!!!!!!!!!!

@method `buffer.fill(value, offset=0, end=buffer.length)`
@param `value`: The value to use, `offset`: The position to start at, `end`

Fills the buffer with the specified value. If the offset and end are not
given it will fill the entire buffer.

#### Example

    var b = new Buffer(50);
    b.fill("h");
    
@method `Buffer.isBuffer(obj)`
@param `obj`: The object to check

Returns `true` if `obj` is a `Buffer`.


@method `buffer.readDoubleBE(offset, noAssert=false)` / `buffer.readDoubleLE(offset, noAssert=false)`
@param `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Reads a 64 bit double from the buffer at the specified offset with
specified endian format--either "BE" for "big endian" or "LE" for "little endian."

"Skipping the validation" means that `offset` may be beyond the end of the buffer. This is typically Not Good.

#### Example

    var buf = new Buffer(8);

    buf[0] = 0x55;
    buf[1] = 0x55;
    buf[2] = 0x55;
    buf[3] = 0x55;
    buf[4] = 0x55;
    buf[5] = 0x55;
    buf[6] = 0xd5;
    buf[7] = 0x3f;

    console.log(buf.readDoubleLE(0));

    // prints 0.3333333333333333
 
@method `buffer.readFloatBE(offset, noAssert=false)` / `buffer.readFloatLE(offset, noAssert=false)`
@param `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Reads a 32 bit float from the buffer at the specified offset with
specified endian format--either "BE" for "big endian" or "LE" for "little endian."

"Skipping the validation" means that `offset` may be beyond the end of the buffer. This is typically Not Good.

#### Example

    var buf = new Buffer(4);

    buf[0] = 0x00;
    buf[1] = 0x00;
    buf[2] = 0x80;
    buf[3] = 0x3f;

    console.log(buf.readFloatLE(0));

    // prints 0x01
    
 
@method `buffer.readInt8(offset, noAssert=false)`
@param `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset

Reads a signed 8 bit integer from the buffer at the specified offset.

"Skipping the validation" means that `offset` may be beyond the end of the buffer. This is typically Not Good.

Works as `buffer.readUInt8()`, except buffer contents are treated as two's
complement signed values.

@method `buffer.readInt16BE(offset, noAssert=false)` / `buffer.readInt16LE(offset, noAssert=false)`
@param `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Reads a signed 16 bit integer from the buffer at the specified offset with
specified endian format--either "BE" for "big endian" or "LE" for "little endian."

"Skipping the validation" means that `offset` may be beyond the end of the buffer. This is typically Not Good.

Works as `buffer.readUInt16*`, except buffer contents are treated as a two's
complement signed values.

@method `buffer.readInt32BE(offset, noAssert=false)` / `buffer.readInt32LE(offset, noAssert=false)`
@param `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Reads a signed 32 bit integer from the buffer at the specified offset with
specified endian format--either "BE" for "big endian" or "LE" for "little endian."

"Skipping the validation" means that `offset` may be beyond the end of the buffer. This is typically Not Good.

Works as `buffer.readUInt32*()`, except buffer contents are treated as a two's
complement signed values.


@method `buffer.readUInt8(offset, noAssert=false)`
@param `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset

Reads an unsigned 8 bit integer from the buffer at the specified offset.

"Skipping the validation" means that `offset` may be beyond the end of the buffer. This is typically Not Good.

#### Example

    var buf = new Buffer(4);

    buf[0] = 0x3;
    buf[1] = 0x4;
    buf[2] = 0x23;
    buf[3] = 0x42;

    for (ii = 0; ii < buf.length; ii++) {
      console.log(buf.readUInt8(ii));
    }

    // prints the following
    // 0x3
    // 0x4
    // 0x23
    // 0x42

@method `buffer.readUInt16BE(offset, noAssert=false) / buffer.readUInt16LE(offset, noAssert=false)`
@param `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset

Reads an unsigned 16 bit integer from the buffer at the specified offset with
specified endian format--either "BE" for "big endian" or "LE" for "little endian."

"Skipping the validation" means that `offset` may be beyond the end of the buffer. This is typically Not Good.

#### Example

    var buf = new Buffer(4);

    buf[0] = 0x3;
    buf[1] = 0x4;
    buf[2] = 0x23;
    buf[3] = 0x42;

    console.log(buf.readUInt16BE(0));
    console.log(buf.readUInt16LE(0));
    console.log(buf.readUInt16BE(1));
    console.log(buf.readUInt16LE(1));
    console.log(buf.readUInt16BE(2));
    console.log(buf.readUInt16LE(2));

    // prints the following
    // 0x0304
    // 0x0403
    // 0x0423
    // 0x2304
    // 0x2342
    // 0x4223

@method `buffer.readUInt32BE(offset, noAssert=false)` / `buffer.readUInt32LE(offset, noAssert=false)`
@param `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset

Reads an unsigned 32 bit integer from the buffer at the specified offset with
specified endian format--either "BE" for "big endian" or "LE" for "little endian."

"Skipping the validation" means that `offset` may be beyond the end of the buffer. This is typically Not Good.

#### Example

    var buf = new Buffer(4);

    buf[0] = 0x3;
    buf[1] = 0x4;
    buf[2] = 0x23;
    buf[3] = 0x42;

    console.log(buf.readUInt32BE(0));
    console.log(buf.readUInt32LE(0));

    // 0x03042342
    // 0x42230403
    
    
@method `buffer.slice(start, end=buffer.length)`
@param `start`: The offset to start from, `end`: The position of the last byte to slice; defaults to the length of the buffer

Returns a new buffer that references the same memory as the old, but offset and cropped by the `start` and `end` indexes.

**Note**: Modifying the new buffer slice modifies memory in the original buffer!

#### Example

Building a `Buffer` with the ASCII alphabet, taking a slice, then modifying one byte from the original `Buffer`:

    var buf1 = new Buffer(26);

    for (var i = 0 ; i < 26 ; i++) {
      buf1[i] = i + 97; // 97 is ASCII a
    }

    var buf2 = buf1.slice(0, 3);
    console.log(buf2.toString('ascii', 0, buf2.length));
    buf1[0] = 33;
    console.log(buf2.toString('ascii', 0, buf2.length));

    // prints the following:
    // abc
    // !bc
    
    
@method `buffer.toString(encoding, start=0, end=buffer.length)`
@param `encoding`: The encoding to use; defaults to `utf8`, `start`: The starting byte offset; defaults to `0`, `end`: The number of bytes to write; defaults to the length of the buffer

Decodes and returns a string from buffer data encoded with `encoding`
beginning at `start` and ending at `end`.

For more information, see the `buffer.write()` example.

@method `buffer.write(string, offset=0, length=buffer.length-offset, encoding='utf8')`
@param `string`: The string to write, `offset`: The starting byte offset; defaults to `0`, `length`: The number of bytes to write; defaults to the length of the buffer (minus any offset), `encoding`: The encoding to use; defaults to `utf8`

Writes a `string` to the buffer at `offset` using the given encoding. `length` is the number of bytes to write. Returns number of octets written. If `buffer` does not contain enough space to fit the entire string, it instead writes a partial amount of the string. The method doesn't write partial characters.

The number of characters written (which may be different than the number of
bytes written) is set in `Buffer._charsWritten` and will be overwritten the
next time `buf.write()` is called.

#### Example

Writing a utf8 string into a buffer, then printing it:

    buf = new Buffer(256);
    len = buf.write('\u00bd + \u00bc = \u00be', 0);
    console.log(len + " bytes: " + buf.toString('utf8', 0, len));


@method `buffer.writeDoubleBE(value, offset, noAssert=false)` / `buffer.writeDoubleLE(value, offset, noAssert=false)`
@param `value`: The content to write, `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Writes `value` to the buffer at the specified offset with specified endian
format--either "BE" for "big endian" or "LE" for "little endian." Note that `value` must be a valid 64 bit double.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
shouldn't be used unless you are certain of correctness.

#### Example

    var buf = new Buffer(8);
    buf.writeDoubleBE(0xdeadbeefcafebabe, 0);

    console.log(buf);

    buf.writeDoubleLE(0xdeadbeefcafebabe, 0);

    console.log(buf);

    // prints the following
    // <Buffer 43 eb d5 b7 dd f9 5f d7>
    // <Buffer d7 5f f9 dd b7 d5 eb 43>

@method `buffer.writeFloatBE(value, offset, noAssert=false)` / `buffer.writeFloatLE(value, offset, noAssert=false)`
@param `value`: The content to write, `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset

Writes `value` to the buffer at the specified offset with specified endian
format--either "BE" for "big endian" or "LE" for "little endian." Note that `value` must be a valid 32 bit float.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
shouldn't be used unless you are certain of correctness.

#### Example

    var buf = new Buffer(4);
    buf.writeFloatBE(0xcafebabe, 0);

    console.log(buf);

    buf.writeFloatLE(0xcafebabe, 0);

    console.log(buf);

    // <Buffer 4f 4a fe bb>
    // <Buffer bb fe 4a 4f>
    
@method `buffer.writeInt8(value, offset, noAssert=false)`
@param `value`: The content to write, `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Writes `value` to the buffer at the specified offset. Note that `value` must be a valid signed 8 bit integer.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
shouldn't be used unless you are certain of correctness.

Works as `buffer.writeUInt8()`, except value is written out as a two's complement
signed integer into `buffer`.

@method `buffer.writeInt16BE(value, offset, noAssert=false)` / `buffer.writeInt16LE(value, offset, noAssert=false)`
@param `value`: The content to write, `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Writes `value` to the buffer at the specified offset with specified endian
format--either "BE" for "big endian" or "LE" for "little endian." Note that `value` must be a valid signed 16 bit integer.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
shouldn't be used unless you are certain of correctness.

Works as `buffer.writeUInt16*()`, except value is written out as a two's
complement signed integer into `buffer`.

@method `buffer.writeInt32BE(value, offset, noAssert=false)` / `buffer.writeInt32LE(value, offset, noAssert=false)`
@param `value`: The content to write, `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Writes `value` to the buffer at the specified offset with specified endian
format--either "BE" for "big endian" or "LE" for "little endian." Note that `value` must be a valid signed 32 bit integer.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
shouldn't be used unless you are certain of correctness.

Works as `buffer.writeUInt32*`, except value is written out as a two's
complement signed integer into `buffer`.



@method `buffer.writeUInt8(value, offset, noAssert=false)`
@param `value`: The content to write, `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Writes `value` to the buffer at the specified offset. Note that `value` must be a valid unsigned 8 bit integer.

Set `noAssert` to `true` to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
shouldn't be used unless you are certain of correctness.

#### Example

    var buf = new Buffer(4);
    buf.writeUInt8(0x3, 0);
    buf.writeUInt8(0x4, 1);
    buf.writeUInt8(0x23, 2);
    buf.writeUInt8(0x42, 3);

    console.log(buf);

    // prints <Buffer 03 04 23 42>

@method `buffer.writeUInt16BE(value, offset, noAssert=false)` / `buffer.writeUInt16LE(value, offset, noAssert=false)` 
@param `value`: The content to write, `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Writes `value` to the buffer at the specified offset with specified endian
format--either "BE" for "big endian" or "LE" for "little endian." Note that `value` must be a valid unsigned 16 bit integer.

Set `noAssert` to `true` to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
shouldn't be used unless you are certain of correctness.

#### Example

    var buf = new Buffer(4);
    buf.writeUInt16BE(0xdead, 0);
    buf.writeUInt16BE(0xbeef, 2);

    console.log(buf);

    buf.writeUInt16LE(0xdead, 0);
    buf.writeUInt16LE(0xbeef, 2);

    console.log(buf);

    // prints the following
    // <Buffer de ad be ef>
    // <Buffer ad de ef be>

@method `buffer.writeUInt32BE(value, offset, noAssert=false)` / `buffer.writeUInt32LE(value, offset, noAssert=false)`
@param `value`: The content to write, `offset`: The starting position, `noAssert`: If `true`, skips the validation of the offset 

Writes `value` to the buffer at the specified offset with specified endian
format--either "BE" for "big endian" or "LE" for "little endian." Note that `value` must be a valid unsigned 32 bit integer.

Set `noAssert` to true to skip validation of `value` and `offset`. This means
that `value` may be too large for the specific function and `offset` may be
beyond the end of the buffer leading to the values being silently dropped. This
shouldn't be used unless you are certain of correctness.

#### Example

    var buf = new Buffer(4);
    buf.writeUInt32BE(0xfeedface, 0);

    console.log(buf);

    buf.writeUInt32LE(0xfeedface, 0);

    console.log(buf);

    // prints the following
    // <Buffer fe ed fa ce>
    // <Buffer ce fa ed fe>



### Properties 

@prop `buffer[index]`

Get and set the octet at `index`. The values refer to individual bytes,
so the legal range is between `0x00` and `0xFF` hex or `0` and `255`.

#### Example

Copying an ASCII string into a buffer, one byte at a time:

    str = "node.js";
    buf = new Buffer(str.length);

    for (var i = 0; i < str.length ; i++) {
      buf[i] = str.charCodeAt(i);
    }

    console.log(buf);

    // prints node.js

@prop `buffer.length`

The size of the buffer in bytes.  Note that this is not necessarily the size of the contents. `length` refers to the amount of memory allocated for the buffer object.  It does not change when the contents of the buffer are changed.

#### Example

    buf = new Buffer(1234);

    console.log(buf.length);
    buf.write("some string", "ascii", 0);
    console.log(buf.length);

    // 1234
    // 1234
    
@param INSPECT_MAX_BYTES

How many bytes will be returned when `buffer.inspect()` is called. This can be overriden by user modules.
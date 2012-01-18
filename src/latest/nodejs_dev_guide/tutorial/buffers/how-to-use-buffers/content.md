### Understanding Buffers

Pure Javascript, while great with unicode-encoded strings, does not handle straight binary data very well. This is fine on the browser, where most data is in the form of strings. However, Node.js servers have to also deal with TCP streams and reading and writing to the filesystem, both of which make it necessary to deal with purely binary streams of data.

One way to handle this problem is to just use strings _anyway_, which is exactly what Node.js did at first. However, this approach is extremely problematic to work with: it's slow, makes you work with an API designed for strings and not binary data, and has a tendency to break in strange and mysterious ways.

Don't use binary strings; use buffers instead!

<Note>For more detailed information, see [the Node.js reference documentation on buffers](../nodejs_ref_guide/buffers.html).</Note>

#### Using Buffers

Buffers are instances of the `Buffer` class in Node.js, which is designed to handle raw binary data. Each buffer corresponds to some raw memory allocated outside the V8 engine. Buffers act somewhat like arrays of integers, but aren't resizable and have a whole bunch of methods specifically for binary data. In addition, the "integers" in a buffer each represent a byte, and so are limited to values from 0 to 255 (2^8 - 1), inclusive.

Buffers are usually seen in the context of binary data coming from streams, such as `fs.createReadStream()`.

#### Creating Buffers:

There are a few ways to create new buffers. For example, this buffer is uninitialized and contains 8 bytes:

    var buffer = new Buffer(8);

This next example is a also an 8-byte bugger, loaded with some content:

    var buffer = new Buffer([ 8, 6, 7, 5, 3, 0, 9]);

Keep in mind that the contents of the array are integers representing bytes.

To encode a buffer string, you can pass an encoding value as an optional second parameter (in this case, UTF-8):

    var buffer = new Buffer("I'm a string!", "utf-8")

UTF-8 is by far the most common encoding used with Node.js, but `Buffer` also supports:

* `ascii`: This encoding is very fast, but is limited to the ASCII character set. Moreover, it will convert `null` characters into spaces, unlike the UTF-8 encoding.
* `ucs2`: A two-byte, little-endian encoding. This can encode a subset of unicode.
* `base64`: This is for Base64 string encoding.
* `binary`: This is the "binary string" format mentioned earlier, and is in the process of being deprecated. Avoid its use.

#### Writing to Buffers

After you create a buffer, you can begin writing strings to it: 

    var buffer = new Buffer(16);
    buffer.write("Hello", "utf-8")

In this case, `buffer.write()` returns 5. This means that we wrote to five bytes of the buffer. The fact that the string "Hello" is also five characters long is coincidental, since each character _just happened_ to be 8 bits each. This is useful if you want to add to the buffer later on:

    > buffer.write(" world!", 5, "utf-8") // returns 7

When `buffer.write` has three arguments, the second argument indicates an offset, or the index of the buffer to start writing at. Thus, the buffer now contains the phrase "Hello world!".

#### Reading from Buffers

The most common way to read buffers is to use the `toString()` method, since many buffers contain text:

    > buffer.toString('utf-8')
    'Hello world!\u0000�k\t'

The first argument indicates the encoding. In this case, due to the garbage characters are the end, it can be seen that not the entire buffer was used. Since we know how many bytes we've written to the buffer, we can simply add more arguments to retrieve the slice that's actually interesting:

    > buffer.toString("utf-8", 0, 12) // 5 + 7 = 12
    'Hello world!'

#### Setting Individual Octets

You can also set individual bits by using an array-like syntax:

    > buffer[12] = buffer[11];
    33
    > buffer[13] = "1".charCodeAt();
    49
    > buffer[14] = buffer[13];
    49
    > buffer[15] = 33
    33
    > buffer.toString("utf-8")
    'Hello world!!11!'

In this example, the remaining bytes are set manually, such that they represent UTF-8 encoded "!" (33) and "1" (49) characters.

#### Additional Buffer Methods

* `Buffer.isBuffer(object)`: This method checks to see if `object` is a buffer, similar to `Array.isArray()`.

* `Buffer.byteLength(string, encoding)`: With this function, you can check the number of bytes required to encode a string with a given encoding (which defaults to UTF-8). This length is not the same as string length, since many characters require more bytes to encode. For example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=buffer.snowman.1.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

The unicode snowman is only one character, but takes 3 entire bytes to encode!

* `Buffer.length()`: This is the length of your buffer, and represents how much memory is allocated. It is not the same as the size of the buffer's contents, since a buffer may be half-filled. For example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=buffer.snowman.2.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

In this example, the contents written to the buffer only consist of three groups (since they represent the single-character snowman), but the buffer's length is still 16, as it was initialized.

* `Buffer.copy(target, targetStart=0, sourceStart=0, sourceEnd=buffer.length)`: This function allows one to copy the contents of one buffer into another. The first argument is the target buffer on which to copy the contents of `buffer`, and the rest of the arguments allow for copying only a subsection of the source buffer to somewhere in the middle of the target buffer. For example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=buffer.snowman.3.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

In this example, the `snowman` buffer, which contains a 3 byte long character, is copied to to the `frosty` buffer, which has the first 16 bytes written to it. Because the snowman character is 3 bytes long, the result takes up 19 bytes of the buffer.

* `Buffer.slice(start, end=buffer.length)`: This function is generally the same as that of `Array.prototype.slice()`, but with one very import difference: the slice is **not** a new buffer and merely references a subset of the memory space. In other words: **modifying the slice will also modify the original buffer**! For example:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=buffer.snowman.4.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

Now Frosty has melted into a puddle of underscores. Bummer.
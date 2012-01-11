### Understanding Streams

Streams are another basic construct in Node.js that encourages asynchronous coding. A 'stream' is Node's I/O abstraction. Streams allow you to process the data as it is generated or retrieved. Streams can be readable, writeable, or both.

Basically, streams use events to deal with data as it happens, rather than only with a callback at the end.  Readable streams emit the event `data` for each chunk of data that comes in, and an `end` event, which is emitted when there is no more data. Writeable streams can be written to with the `write()` function, and closed with the `end()` function.  All types of streams emit `error` events when errors arise.

As a quick example, we can write a simple version of `cp` (the Unix utility that copies files). We could do this by reading the whole file with standard filesystem calls and then writing it out to a file. Unfortunately, that requires that the whole file be read in before it can be written. In the case of a one or two gigabyte file, you could run into out of memory operations failry quickly. 

The biggest advantage that streams give you over their non-stream versions is that you can start to process the data before you have all the information. Writing out the file doesn't speed up, but if we were streaming over the internet or doing CPU processing on it then there could be measurable performance improvements.

Create a new file called `cp.js`, and copy-paste the following code:

    var fs = require('fs');
    console.log(process.argv[2], '->', process.argv[3]);

    var readStream = fs.createReadStream(process.argv[2]);
    var writeStream = fs.createWriteStream(process.argv[3]);

    readStream.on('data', function (chunk) {
      writeStream.write(chunk);
    });

    readStream.on('end', function () {
      writeStream.end();
    });

    //Some basic error handling
    readStream.on('error', function (err) {
      console.log("ERROR", err);
    });

    writeStream.on('error', function (err) {
      console.log("ERROR", err);
    });

Run this script with arguments like `node cp.js src.txt dest.txt`. This would mean, in the code above, that `process.argv[2]` is `src.txt` and `process.argv[3]` is `desc.txt`. Obviously, you'll need some dummy text files before you can run the script.

The code sets up a readable stream from the source file and a writable stream to the destination file. Whenever the readable stream gets data, it is written to the writeable stream. After it's done, it closes the writable stream when the readable stream is finished. **Note**: it would have been better to use [pipe](how-to-use-stream-pipe.html) like `readStream.pipe(writeStream);`. However, to show how streams work, we have done things the long way.
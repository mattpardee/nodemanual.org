# Writing to Files

Writing to a file is another of the basic programming tasks that one usually needs to know about. This task is very simple in Node.js.  We can use the handy `writeFile()` method inside the standard library's `fs` module, which can save all sorts of time and trouble.

    fs = require('fs');
    fs.writeFile(filename, data, [encoding], [callback])

Here's what the parameters mean:

* `file` is a string filepath of the file to read

* `data` is a string or buffer of the data you want to write to the file

* `encoding` is an optional string defining the encoding of the `data`. Possible encodings are 'ascii', 'utf8', and 'base64'. If no encoding provided, then the default is 'utf8'
*
* `callback` is an optional function that receives an error message, like so: `function (err) {}`. If there is no error, `err === null`; otherwise `err` contains the error message.

For example, if we wanted to write "Hello World" to `helloworld.txt`:

    fs = require('fs');
    fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
      if (err) return console.log(err);
      console.log('Hello World > helloworld.txt');
    });

    [contents of helloworld.txt]:
    Hello World!

If we purposely want to cause an error, we can try to write to a file that we don't have permission to access:

    fs = require('fs')
    fs.writeFile('/etc/doesntexist', 'abc', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    });

The console then prints:

    { stack: [Getter/Setter],
      arguments: undefined,
      type: undefined,
      message: 'EACCES, Permission denied \'/etc/doesntexist\'',
      errno: 13,
      code: 'EACCES',
      path: '/etc/doesntexist' }
# Reading Files

Reading the contents of a file into memory is a very common programming task, and, as with many other things, the Node.js core API provides methods to make this trivial.  There are a variety of file system methods, all contained in the `fs` module.  The easiest way to read the entire contents of a file is with `fs.readFile()`, as follows:

    fs = require('fs');
    fs.readFile(file, [encoding], [callback]);

Here's what the parameters do:

* `file` is a string filepath of the file to read
* `encoding` is an optional parameter that specifies the type of encoding to read the file. Possible encodings are 'ascii', 'utf8', and 'base64'. If no encoding is provided, the default is `utf8`.
* `callback` is an optional function to call when the file has been read and the contents are ready. It is passed two arguments: `error` and `data`.  If there is no error, `error` will be `null` and `data` will contain the file contents; otherwise `err` contains the error message.

If we wanted to read `/etc/hosts` and print it to stdout (just like UNIX `cat`), we might try doing this:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/fs/read.file.1.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

The contents of `/etc/hosts` should now be visible to you, provided you have permission to read the file in the first place.

Let's now take a look at an example of what happens when you try to read an invalid file&mdash;the easiest example is one that doesn't exist.

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/fs/read.file.2.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

This is the output:

    { stack: [Getter/Setter],
      arguments: undefined,
      type: undefined,
      message: 'ENOENT, No such file or directory \'/doesnt/exist\'',
      errno: 2,
      code: 'ENOENT',
      path: '/doesnt/exist' }

This is a basic Node.js [Error object](what-is-the-error-object.html). It can often be useful to log `err.stack` directly, since this contains a stack trace to the location in code at which the Error object was created.
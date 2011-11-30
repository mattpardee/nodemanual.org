## Working with the File System

File I/O is provided by simple wrappers around standard POSIX functions. To use this module, include `require('fs')` in your code. All the read and write methods methods have asynchronous and synchronous forms.

The asynchronous form always take a completion callback as its last argument. The arguments passed to the completion callback depend on the method, but the first argument is always reserved for an exception. If the operation was completed successfully, then the first argument will be `null` or `undefined`.

When using the synchronous form, any exceptions are immediately thrown. You can use `try/catch` to handle exceptions, or allow them to bubble up.

Here's an example of a asynchronous delete:

    var fs = require('fs');

    fs.unlink('/tmp/hello', function (err) {
      if (err) throw err;
      console.log('successfully deleted /tmp/hello');
    });

And here's the synchronous version:

    var fs = require('fs');

    fs.unlinkSync('/tmp/hello')
    console.log('successfully deleted /tmp/hello');

With the asynchronous methods, there is no guaranteed ordering. As an example, the following is prone to error:

    fs.rename('/tmp/hello', '/tmp/world', function (err) {
      if (err) throw err;
      console.log('renamed complete');
    });
    fs.stat('/tmp/world', function (err, stats) {
      if (err) throw err;
      console.log('stats: ' + JSON.stringify(stats));
    });

It could be that `fs.stat` is executed before `fs.rename`. The correct way to do this is to chain the callbacks like this:

    fs.rename('/tmp/hello', '/tmp/world', function (err) {
      if (err) throw err;
      fs.stat('/tmp/world', function (err, stats) {
        if (err) throw err;
        console.log('stats: ' + JSON.stringify(stats));
      });
    });

In busy processes, the programmer is **strongly encouraged** to use the asynchronous versions of these calls. The synchronous versions block the entire process until they complete&mdash;halting all connections.

When processing files, relative paths to filename can be used; however, this path is relative to `process.cwd()`.

### Methods 

@method `fs.rename(path1, path2, [callback(err)])`
@param `path1`: The original filename and path, `path2`: The new filename and path, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [rename(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/rename.2.html) operation. Turns `path1` into `path2`, like magic.

@method `fs.renameSync(path1, path2)`
@param `path1`: The original filename and path, `path2`: The new filename and path

A synchronous [rename(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/rename.2.html) operation. Turns `path1` into `path2`, like witchcraft.

@method `fs.truncate(fd, len, [callback(err)])`
@param `fd`: The file descriptor, `len`: The final file length, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [ftruncate(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/truncate.2.html). It truncates a file to the specified length.

@method `fs.truncateSync(fd, len)`
@param `fd`: The file descriptor, `len`: The final file length

A synchronous [ftruncate(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/truncate.2.html). It truncates a file to the specified length.

@method `fs.chown(path, uid, gid, [callback(err)])`
@param `path`: The path to the file, `uid`: The new owner id, `gid`: The new group id, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [chown(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/chown.2.html). This changes the ownership of the file specified by `path`, which is dereferenced if it is a symbolic link.

@method `fs.chownSync(path, uid, gid)`
@param `path`: The path to the file, `uid`: The new owner id, `gid`: The new group id

A synchronous [chown(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/chown.2.html). This changes the ownership of the file specified by `path`, which is dereferenced if it is a symbolic link

@method `fs.fchown(fd, uid, gid, [callback(err)])`
@param `path`: The path to the file, `uid`: The new owner id, `gid`: The new group id, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [fchown(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/fchown.2.html). This changes the ownership of the file referred to by the open file descriptor fd.

@method `fs.fchownSync(fd, uid, gid)`
@param `path`: The path to the file, `uid`: The new owner id, `gid`: The new group id

A synchronous [fchown(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/fchown.2.html). This changes the ownership of the file referred to by the open file descriptor fd.

@method `fs.lchown(path, uid, gid, [callback(err)])`
@param `path`: The path to the file, `uid`: The new owner id, `gid`: The new group id, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [lchown(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/lchown.2.html). This is like `chown()`, but doesn't dereference symbolic links

@method `fs.lchownSync(path, uid, gid)`
@param `path`: The path to the file, `uid`: The new owner id, `gid`: The new group id

Synchronous [lchown(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/lchown.2.html). This is like `chown()`, but doesn't dereference symbolic links

@method `fs.chmod(path, mode, [callback(err)])`
@param `path`: The path to the file, `mode`: The new permissions, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [chmod(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/chmod.2.html). This changes the permissions of the file specified whose, which is dereferenced if it is a symbolic link.

@method `fs.chmodSync(path, mode)`
@param `path`: The path to the file, `mode`: The new permissions

A synchronous [chmod(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/chmod.2.html). This changes the permissions of the file specified whose, which is dereferenced if it is a symbolic link.

@method `fs.fchmod(fd, mode, [callback(err)])`
@param `fd`: The file descriptor, `mode`: The new permissions, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [fchmod(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/fchmod.2.html). This changes the permissions of the file referred to by the open file descriptor.

@method `fs.fchmodSync(fd, mode)`
@param `fd`: The file descriptor, `mode`: The new permissions

A synchronous [fchmod(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/fchmod.2.html). This changes the permissions of the file referred to by the open file descriptor.

@method `fs.lchmod(path, mode, [callback()])`
@param `path`: The path to the file, `mode`: The new permissions, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [lchmod(2)](http://www.daemon-systems.org/man/lchmod.2.html). This is like `chmod()` except in the case where the named file is a symbolic link, in which case `lchmod()` sets the permission bits of the link, while `chmod()` sets the bits of the file the link references.

@method `fs.lchmodSync(path, mode)`
@param `path`: The path to the file, `mode`: The new permissions

A synchronous [lchmod(2)](http://www.daemon-systems.org/man/lchmod.2.html). This is like `chmod()` except in the case where the named file is a symbolic link, in which case `lchmod()` sets the permission bits of the link, while `chmod()` sets the bits of the file the link references.

@method `fs.stat(path, [callback(err, stats)])`
@param `path`: The path to the file, `[callback(err, stats)]`: An optional callback to execute once the function completes

An asynchronous [stat(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/stat.2.html). 

The callback gets two arguments `(err, stats)` where `stats` is a [fs.Stats](#fs.Stats) object. For more information, see the [fs.Stats](#fs.Stats) section .

@method `fs.lstat(path, [callback()])`
@param `path`: The path to the file, `[callback(err, stats)]`: An optional callback to execute once the function completes

An asynchronous [lstat(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/stat.2.html). 

The callback gets two arguments `(err, stats)` where `stats` is a `fs.Stats` object. `lstat()` is identical to `stat()`, except that if `path` is a symbolic link, then the link itself is stat-ed, not the file that it refers to.

@method `fs.fstat(fd, [callback()])`
@param `fd`: The file descriptor, `[callback(err, stats)]`: An optional callback to execute once the function completes

An asynchronous [fstat(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/stat.2.html). 

The callback gets two arguments `(err, stats)` where `stats` is a `fs.Stats` object. `fstat()` is identical to `stat()`, except that the file to be stat-ed is specified by the file descriptor `fd`.

@method `fs.statSync(path)`
@param `path`: The path to the file

A synchronous [stat(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/stat.2.html). Returns an instance of `fs.Stats`.

@method `fs.lstatSync(path)`
@param `path`: The path to the file

A synchronous [lstat(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/stat.2.html). Returns an instance of `fs.Stats`.

@method `fs.fstatSync(fd)`
@param `fd`: The file descriptor

A synchronous [fstat(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/stat.2.html). Returns an instance of `fs.Stats`.

@method `fs.link(srcpath, dstpath, [callback(err)])`
@param `srcpath`: The original path of a file, `dstpath`: The new file link path, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [link(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/link.2.html).

@method `fs.linkSync(srcpath, dstpath)`
@param `srcpath`: The original path of a file, `dstpath`: The new file link path

A synchronous [link(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/link.2.html).

@method `fs.symlink(linkdata, path, [callback(err)])`
@param `linkdata`: The original path of a file, `path`: The new file link path, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [symlink(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/symlink.2.html).

@method `fs.symlinkSync(linkdata, path)`
@param `linkdata`: The original path of a file, `path`: The new file link path

Synchronous [symlink(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/symlink.2.html).

@method `fs.readlink(path, [callback(err, linkString)])`
@param `path`: The original path of a link, `[callback(err, linkString)]`: An optional callback to execute once the function completes; `err` is the possible exception and `linkString` is the symlink's string value

An asynchronous [readlink(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/readlink.2.html).

@method `fs.readlinkSync(path)`
@param `path`: The original path of a link

A synchronous [readlink(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/readlink.2.html). Returns the symbolic link's string value.

@method `fs.realpath(path, [callback(err, resolvedPath)])`
@param `path`: A path, `[callback(err, resolvedPath)]`: An optional callback to execute once the function completes; `err` is the possible exception and `resolvedPath` is the resolved path string

An asynchronous [realpath(3)](http://www.kernel.org/doc/man-pages/online/pages/man3/realpath.3.html). You can  use `process.cwd()` to resolve relative paths.

@method `fs.realpathSync(path)`
@param `path`: A path

A synchronous [realpath(3)](http://www.kernel.org/doc/man-pages/online/pages/man3/realpath.3.html). Returns the resolved path.

@method `fs.unlink(path, [callback(err)])`
@param `srcpath`: The path to a file, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [unlink(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/unlink.2.html).

@method `fs.unlinkSync(path)`
@param `srcpath`: The path to a file

A synchronous [unlink(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/unlink.2.html).

@method `fs.rmdir(path, [callback(err)])`
@param `path`: The path to a directory, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [rmdir(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/rmdir.2.html).

### fs.rmdirSync(path)

A synchronous [rmdir(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/rmdir.2.html).

@method `fs.mkdir(path, [mode=0777], [callback(err)])`
@param `path`: The path to the new directory, `mode`: An optional permission to set; defaults to `0777`, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous [mkdir(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/mkdir.2.html). 

@method `fs.mkdirSync(path, [mode=0777])`
@param `path`: The path to the new directory, `mode`: An optional permission to set; defaults to `0777`

A synchronous [mkdir(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/mkdir.2.html).

@method `fs.readdir(path, [callback(err, files)])`
@param `path`: The path to the directory, `[callback(err, files)]`: An optional callback to execute once the function completes; `err` is the possible exception; `files` is an array of the names of the files in the directory (excluding `'.'` and `'..'`)

An asynchronous [readdir(3)](http://www.kernel.org/doc/man-pages/online/pages/man3/readdir.3.html).  It reads the contents of a directory.

@method `fs.readdirSync(path)`
@param `path`: The path to the directory

A synchronous [readdir(3)](http://www.kernel.org/doc/man-pages/online/pages/man3/readdir.3.html). Returns an array of filenames, excluding `'.'` and
`'..'`.

@method `fs.close(fd, [callback(err)])`
@param `fd`: The file descriptor, `[callback(err)]`: An optional callback to execute once the function completes; `err` is the possible exception

An asynchronous file close; for more information, see [close(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/close.2.html).

@method `fs.closeSync(fd)`
@param `fd`: The file descriptor

A synchronous file close; for more information, see [close(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/close.2.html).

@method `fs.open(path, flags, [mode=0666], [callback(err, fd)])`
@param `path`: The path to the file, `flags`: A string indicating how to open the file, `[mode]`: The optional permissions to give the file if it's created, `[callback(err, fd)]`: An optional callback to execute once the function completes; `err` is the possible exception; `fd` is an open file descriptor

An asynchronous file open; for more information, see [open(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/open.2.html). 

`flags` can be one of the following:

* `'r'`: Opens the file for reading. An exception occurs if the file does not exist.

* `'r+'`: Opens the file for reading and writing. An exception occurs if the file does not exist.

* `'w'`: Opens the file for writing. The file is created (if it does not exist) or truncated (if it exists).

* `'w+'`: Opens the file for reading and writing. The file is created (if it doesn't exist) or truncated (if it exists).

* `'a'`: Opens the file for appending. The file is created if it doesn't exist.

* `'a+'`: Opens the file for reading and appending. The file is created if it doesn't exist.

@method `fs.openSync(path, flags, [mode=0666])`
@param `path`: The path to the file, `flags`: A string indicating how to open the file, `[mode]`: The optional permissions to give the file if it's created

A synchronous file open; for more information, see [open(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/open.2.html). This returns an open file descriptor.

`flags` can be one of the following:

* `'r'`: Opens the file for reading. An exception occurs if the file does not exist.

* `'r+'`: Opens the file for reading and writing. An exception occurs if the file does not exist.

* `'w'`: Opens the file for writing. The file is created (if it does not exist) or truncated (if it exists).

* `'w+'`: Opens the file for reading and writing. The file is created (if it doesn't exist) or truncated (if it exists).

* `'a'`: Opens the file for appending. The file is created if it doesn't exist.

* `'a+'`: Opens the file for reading and appending. The file is created if it doesn't exist.

@method `fs.utimes(path, atime, mtime, [callback()])`
@param `path`: The path to the file, `atime`: The new access time, `mtime`: The new modification time, `[callback()]`: An optional callback to execute once the function completes

An asynchronous [utime(2)](http://kernel.org/doc/man-pages/online/pages/man2/utime.2.html). Change file timestamps of the file referenced by the supplied path.

@method `fs.utimesSync(path, atime, mtime)`
@param `path`: The path to the file, `atime`: The new access time, `mtime`: The new modification time

A synchronous [utime(2)](http://kernel.org/doc/man-pages/online/pages/man2/utime.2.html). Change file timestamps of the file referenced by the supplied path.

@method `fs.futimes(fd, atime, mtime, [callback()])`
@param `fd`: The file descriptor, `atime`: The new access time, `mtime`: The new modification time, `[callback()]`: An optional callback to execute once the function completes

An asynchronous [futimes(3)](http://www.kernel.org/doc/man-pages/online/pages/man3/lutimes.3.html). Change the file timestamps of a file referenced by the supplied file descriptor.

@method `fs.futimesSync(fd, atime, mtime)`
@param `fd`: The file descriptor, `atime`: The new access time, `mtime`: The new modification time

A synchronous [futimes(3)](http://www.kernel.org/doc/man-pages/online/pages/man3/lutimes.3.html). Change the file timestamps of a file referenced by the supplied file descriptor.

@method `fs.fsync(fd, [callback(err)])`
@param `fd`: The file descriptor, `[callback()]`: An optional callback to execute once the function completes

An asynchronous [fsync(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/fsync.2.html).

@method `fs.fsyncSync(fd)`
@param `fd`: The file descriptor

A synchronous [fsync(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/fsync.2.html).

@method `fs.write(fd, buffer, offset, length, position, [callback(err, written, buffer)])`
@param `fd`: The file descriptor, `buffer`: The buffer to write, `offset`: Indicates where in the buffer to start at, `length`: Indicates how much of the buffer to use, `position`: The offset from the beginning of the file where this data should be written, `[callback(err, written, buffer)]`: An optional callback to execute once the function completes; `err` is the possible exception; `written` specifies how many bytes were written from `buffer`; `buffer` is the rest of the buffer

Writes `buffer` to the file specified by `fd`. Note that it's unsafe to use `fs.write` multiple times on the same file without waiting for the callback. For this scenario, `fs.createWriteStream()` is strongly recommended.

For more information, see [pwrite(2)](http://www.kernel.org/doc/man-pages/online/pages/man2/pwrite.2.html).

@method `fs.writeSync(fd, buffer, offset, length, position)`
@param `fd`: The file descriptor, `buffer`: The buffer to write, `offset`: Indicates where in the buffer to start at, `length`: Indicates how much of the buffer to use, `position` The offset from the beginning of the file where this data should be written

A synchronous version of the buffer-based `fs.write()`. Returns the number of bytes written.

@method `fs.writeSync(fd, str, position, encoding='utf8')`
@param `fd`: The file descriptor, `str`: The string to write, `offset`: Indicates where in the buffer to start at, `position` The offset from the beginning of the string where thiyou should start writing from, `encoding`: The encoding to use during the write

A synchronous version of the string-based `fs.write()`. This returns the number of bytes written.

@method `fs.read(fd, buffer, offset, length, position, [callback()])`
@param `fd`: The file descriptor to read from, `buffer`: The buffer to write to, `offset`: Indicates where in the buffer to start writing at, `length`: Indicates the number of bytes to read, `position`: The offset from the beginning of the file where the reading should begin, `[callback(err, bytesRead, buffer)]`: An optional callback to execute once the function completes; `err` is the possible exception; `bytesRead` specifies how many bytes were read from `buffer`; `buffer` is the rest of the buffer

Read data from the file specified by `fd` and writes it to `buffer`. If `position` is `null`, data will be read from the current file position.

@method `fs.readSync(fd, buffer, offset, length, position)`
@param `fd`: The file descriptor to read from, `buffer`: The buffer to write to, `offset`: Indicates where in the buffer to start writing at, `length`: Indicates the number of bytes to read, `position`: The offset from the beginning of the file where the reading should begin

The synchronous version of buffer-based `fs.read()`. Returns the number of bytes read.

@method `fs.readSync(fd, length, position, encoding)`
@param `fd`: The file descriptor to read from, `length`: Indicates the number of bytes to read, `position`: The offset from the beginning of the file where the reading should begin, `encoding`: The encoding to use

Synchronous version of string-based `fs.read`. Returns the number of bytes read.

@method `fs.readFile(filename, [encoding], [callback(err, data)])`
@param `filename`: The name of the file to read, `encoding`: The encoding to use, `[callback(err, data)]`: An optional callback to execute once the function completes; `err` is the possible exception; `data` is the contents of the file

Asynchronously reads the entire contents of a file. If no encoding is specified, then the raw buffer is returned.

#### Example

    fs.readFile('/etc/passwd', function (err, data) {
      if (err) throw err;
      console.log(data);
    });

@method `fs.readFileSync(filename, [encoding])`
@param `filename`: The name of the file to read, `encoding`: The encoding to use

Synchronous version of `fs.readFile()`. Returns the contents of the `filename`.

If `encoding` is specified, then this function returns a string. Otherwise it returns a buffer.


@method `fs.writeFile(filename, data, encoding='utf8', [callback()])`
@param `filename`: The name of the file to write to, `data`: The data to write (this can be a string or a buffer), `encoding`: The encoding to use (this is ignored if `data` is a buffer), `[callback()]`: An optional callback to execute once the function completes

Asynchronously writes data to a file, replacing the file if it already exists.

#### Example

    fs.writeFile('message.txt', 'Hello Node', function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });

@method `fs.writeFileSync(filename, data, encoding='utf8')`
@param `filename`: The name of the file to write to, `data`: The data to write (this can be a string or a buffer), `encoding`: The encoding to use (this is ignored if `data` is a buffer)

The synchronous version of `fs.writeFile()`.

@method `fs.watchFile(filename, [options={ persistent: true, interval: 0 }], listener(curr, prev))`
@param `filename`: The name of the file to watch, `[options]`: Any optional arguments indicating how often to watch, `listener(curr, prev)`: The callback to execute each time the file is accessed; `curr` is the current time; `prev` was the last change time

Watches for changes on `filename`. 

`options`, if provided, should be an object containing two boolean members: `persistent` and `interval`. `persistent` indicates whether the process should continue to run as long as files are being watched. `interval` indicates how often the target should be polled, in milliseconds. (On Linux systems with [inotify](http://en.wikipedia.org/wiki/Inotify), `interval` is ignored.) 

The `listener()` gets two arguments the current stat object and the previous stat object:

    fs.watchFile('message.text', function (curr, prev) {
      console.log('the current mtime is: ' + curr.mtime);
      console.log('the previous mtime was: ' + prev.mtime);
    });

These stat objects are instances of `fs.Stat`.

If you want to be notified when the file was modified, not just accessed, you need to compare `curr.mtime` and `prev.mtime`.


@method `fs.unwatchFile(filename)`
@param `filename`: The filename to watch

Stops watching for changes on `filename`.

@method `fs.watch(filename, [options = {persistent: true}], listener(event, filename))`
@param `filename`: The filename (or directory) to watch, `[options]`: An optional arguments indicating how to watch, `listener(event, filename)`: The callback to execute each time the file is accessed; `event` is either `'rename'` or '`change'`; `filename` is the name of the file which triggered the event

Watch for changes on `filename`. The returned object is an [fs.FSWatcher](#fs.FSWatcher).

`options`, if provided, should be an object containing a boolean member `persistent`, which indicates whether the process should continue to run as long as files are being watched.

**Warning:** Providing the `filename` argument in the callback is not supported on every platform (currently it's only supported on Linux and Windows).  Even on supported platforms, `filename` is **not** always guaranteed to be provided. Therefore, don't assume that `filename` argument is always provided in the callback, and have some fallback logic if it is `null`:

    fs.watch('somedir', function (event, filename) {
        console.log('event is: ' + event);
        if (filename) {
            console.log('filename provided: ' + filename);
        } else {
        console.log('filename not provided');
        }
    });

### Objects

@obj `fs.Stats`

Objects returned from `fs.stat()`, `fs.lstat()` and `fs.fstat()` (and their synchronous counterparts) are of this type.

 - `stats.isFile()`
 - `stats.isDirectory()`
 - `stats.isBlockDevice()`
 - `stats.isCharacterDevice()`
 - `stats.isSymbolicLink()` (only valid with  `fs.lstat()`)
 - `stats.isFIFO()`
 - `stats.isSocket()`

For a regular file, `util.inspect(stats)` returns a string similar to this:

    { dev: 2114,
      ino: 48064969,
      mode: 33188,
      nlink: 1,
      uid: 85,
      gid: 100,
      rdev: 0,
      size: 527,
      blksize: 4096,
      blocks: 8,
      atime: Mon, 10 Oct 2011 23:24:11 GMT,
      mtime: Mon, 10 Oct 2011 23:24:11 GMT,
      ctime: Mon, 10 Oct 2011 23:24:11 GMT }

Please note that `atime`, `mtime` and `ctime` are instances of the [Date][MDN-Date] object, and to compare the values of these objects you should use appropriate methods. For most general uses, [getTime()][MDN-Date-getTime] will return the number of milliseconds elapsed since _1 January 1970 00:00:00 UTC_, and this integer should be sufficient for any comparison. However there are additional methods which can be used for displaying fuzzy information. More details can be found on the [MDN JavaScript Reference][MDN-Date] page.

[MDN-Date]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date
[MDN-Date-getTime]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getTime

@obj `fs.ReadStream`

`ReadStream` is a [Readable Stream](streams.html#readable_Stream).

### Event

@event `'open'`
@cb `function(fd)`: The callback to execute once the event fires, `fd` : The file descriptor used by the `ReadStream`

Emitted when a file is opened.

@method `fs.createReadStream(path, [options])`
@param `path`: The path to read from, `[options]`: Any optional arguments indicating how to read the stream

Returns a new [ReadStream](#readstream) object.

`options` is an object with the following defaults:

    { flags: 'r',
      encoding: null,
      fd: null,
      mode: 0666,
      bufferSize: 64 * 1024
    }

`options` can include `start` and `end` values to read a range of bytes from
the file instead of the entire file.  Both `start` and `end` are inclusive and
start at 0.

#### Example

Here's an example to read the last 10 bytes of a file which is 100 bytes long:

    fs.createReadStream('sample.txt', {start: 90, end: 99});


### Object

@obj `fs.WriteStream`

`WriteStream` is a [Writable Stream](streams.html#writable_Stream).

### Events

@event `'open'`
@cb `function(fd)`: The callback to execute once the event fires, `fd` : The file descriptor used by the `WriteStream`

Emitted when a file is opened.

@prop `file.bytesWritten`

The number of bytes written so far. This doesn't include data that is still queued
for writing.

@method `fs.createWriteStream(path, [options])`
@param `path`: The path to read from, `[options]`: Any optional arguments indicating how to write the stream

Returns a new [WriteStream](#writestream) object.

`options` is an object with the following defaults:

    { flags: 'w',
      encoding: null,
      mode: 0666 }

`options` may also include a `start` option to allow writing data at some position past the beginning of the file.  

Modifying a file rather than replacing it may require a `flags` mode of `r+` rather than the default mode `w`.

### Object
@obj `fs.FSWatcher`

Objects returned from `fs.watch()` are of this type.

@method `watcher.close()`

Stop watching for changes on the given `fs.FSWatcher`.

### Event

@event `'change'`
@cb `function(event, filename)`: The callback to execute once the event fires, `event`: The event that occured, either `'rename'` or '`change'`, `filename` is the name of the file which triggered the event

Emitted when something changes in a watched directory or file. See more details in [fs.watch](#fs.watch).

@event `'error'`
@cb `function(exception)`: The callback to execute once the event fires, `exception`: The exception that was caught

Emitted when an error occurs.

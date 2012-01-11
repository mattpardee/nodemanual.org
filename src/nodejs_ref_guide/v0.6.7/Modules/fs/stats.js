
/**
 * class fs.Stats
 *
 * Objects returned from [[fs.stat `fs.stat()`]], [[fs.lstat `fs.lstat()`]], and [[fs.fstat `fs.fstat()`]] (and their synchronous counterparts) are of this type. The object contains the following methods:
 * 
 * - `stats.isFile()`: indicates if the object is a file
 * - `stats.isDirectory()`: indicates if the object is a directory
 * - `stats.isBlockDevice()`: indicates if the object is a [block device](http://en.wikipedia.org/wiki/Device_file#Block_devices)
 * - `stats.isCharacterDevice()`: indicates if the object is a [character device](http://en.wikipedia.org/wiki/Device_file#Character_devices)
 * - `stats.isSymbolicLink()`: indicates if the object is a symbolic link; this is only valid with `fs.lstat()` and `fs.lstatSynch()`.
 * - `stats.isFIFO()`: indicates if the object is a [named pipe](http://en.wikipedia.org/wiki/Named_pipe)
 * - `stats.isSocket()`: indicates if the object is a [socket file](http://en.wikipedia.org/wiki/Unix_file_types#Socket)
 * 
 * For a regular file, `util.inspect(stats)` returns a string similar to this:
 * 
 *     { dev: 2114,
 *       ino: 48064969,
 *       mode: 33188,
 *       nlink: 1,
 *       uid: 85,
 *       gid: 100,
 *       rdev: 0,
 *       size: 527,
 *       blksize: 4096,
 *       blocks: 8,
 *       atime: Mon, 10 Oct 2011 23:24:11 GMT,
 *       mtime: Mon, 10 Oct 2011 23:24:11 GMT,
 *       ctime: Mon, 10 Oct 2011 23:24:11 GMT }
 * 
 * Please note that `atime`, `mtime`, and `ctime` are instances of the [Date][MDN-Date] object, and to compare the values of these objects you should use appropriate methods. For most general uses, [getTime()][MDN-Date-getTime] will return the number of milliseconds elapsed since _1 January 1970 00:00:00 UTC_, and this integer should be sufficient for any comparison. However, there are additional methods which can be used for displaying fuzzy information. More details can be found on the [MDN JavaScript Reference][MDN-Date] page.
 * 
 * [MDN-Date]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date
 * [MDN-Date-getTime]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/getTime
 * 
**/






 



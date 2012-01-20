var Path = require('path'),
    Url = require('url'),
    Fs = require('fs'),
    getMime = require('simple-mime')("application/octet-stream");

// Super simple static file server
module.exports = function setup(mount, root, index) {
  return function (req, res, next) {
    if (req.method !== 'GET') return next();
    if (!req.uri) { req.uri = Url.parse(req.url); }
    var path = unescape(req.uri.pathname).replace(/\.\.+/g, '.');
    if (!path || path.substr(0, mount.length) !== mount) {
      return next();
    }
    path = Path.join(root, path.substr(mount.length));
    if (path[path.length - 1] === '/') {
      path = path.substr(0, path.length - 1);
    }
    function onStat(err, stat) {
      if (err) { 
        if (err.code === 'ENOENT') { return next(); }
        return next(err);
      }
      if (index && stat.isDirectory()) {
        path = Path.join(path, index);
        return Fs.stat(path, onStat);
      }
      if (!stat.isFile()) {
        return next(err);
      }
      var headers = {
        "Date": (new Date()).toUTCString(),
        "Last-Modified": stat.mtime.toUTCString()
      };
      if (headers["Last-Modified"] === req.headers["if-modified-since"]) {
        res.writeHead(304, headers);
        res.end();
        return;
      }
      var start = 0;
      var end = stat.size - 1;
      var code = 200;
      if (req.headers.range) {
        var p = req.headers.range.indexOf('=');
        var parts = req.headers.range.substr(p + 1).split('-');
        if (parts[0].length) { 
          start = parseInt(parts[0], 10);
          if (parts[1].length) {
            end = parseInt(parts[1], 10);
          }
        } else {
          if (parts[1].length) {
            start = end + 1 - parseInt(parts[1], 10);
          }
        }
        if (end < start || start < 0 || end >= stat.size) {
          res.writeHead(416, headers);
          res.end();
          return;
        }
        code = 206;
        headers["Content-Range"] = "bytes " + start + "-" + end + "/" + stat.size;
      }
      headers["Content-Length"] = end - start + 1;
      headers["Content-Type"] = getMime(path);
      if (stat.size === 0) {
        res.writeHead(code, headers);
        return res.end();
      }
      if (process.ENOENT) {
        Fs.readFile(path, function (err, data) {
          if (err) { return next(err); }
          res.writeHead(code, headers);
          res.end(data);
        });
        return;
      }
      var stream = Fs.createReadStream(path, {start: start, end: end});
      stream.once('data', function (chunk) {
        res.writeHead(code, headers);
      });
      stream.pipe(res);
      stream.on('error', next);
    }
    Fs.stat(path, onStat);
  };
};

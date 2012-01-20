var Url = require('url');
var FS = require('fs');
var Path = require('path');

module.exports = function deleter(mount, root) {
  return function (req, res, next) {
    if (req.method !== "DELETE") return next();
    if (!req.uri) { req.uri = Url.parse(req.url); }
    var path = unescape(req.uri.pathname).replace(/\.\.+/g, '.');
    if (!path || path.substr(0, mount.length) !== mount) {
      return next();
    }
    path = Path.join(root, path.substr(mount.length));
    FS.unlink(path, function (err) {
      if (err) {
        if (err.code == "ENOENT") return next();
        return next(err);
      }
      res.writeHead(200, {});
      res.end();
    });
  };
}

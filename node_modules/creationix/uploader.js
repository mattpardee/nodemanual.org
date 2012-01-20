var FS = require('fs'),
    Url = require('url'),
    Path = require('path');

module.exports = function setup(mount, root) {
  return function handle(req, res, next) {
    if (req.method !== "PUT") return next();
    if (!req.uri) { req.uri = Url.parse(req.url); }
    var path = unescape(req.uri.pathname).replace(/\.\.+/g, '.');
    if (!path || path.substr(0, mount.length) !== mount) {
      return next();
    }
    path = Path.join(root, path.substr(mount.length));
    var stream = FS.createWriteStream(path);
    stream.on('error', next);
    req.pipe(stream);
    req.on('end', function () {
      res.writeHead(200, {});
      res.end();
    });
  };
};

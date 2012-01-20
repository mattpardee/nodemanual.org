var Fs = require('fs'),
    Path = require('path'),
    Url = require('url'),
    getMime = require('simple-mime')("application/octet-stream");

module.exports = function setup(mount, root, showHidden) {

  return function handle(req, res, next) {
    if (!req.uri) { req.uri = Url.parse(req.url); }
    var path = unescape(req.uri.pathname).replace(/\.\.+/g, '.');
    if (!path || path.substr(0, mount.length) !== mount) {
      return next();
    }
    path = Path.join(root, path.substr(mount.length));
    if (path[path.length - 1] === '/') { path = path.substr(0, path.length - 1); }
    Fs.stat(path, function (err, stat) {
      if (err) { 
        if (err.code === 'ENOENT') { return next(); }
        return next(err); 
      }
      if (!stat.isDirectory()) {
        return next();
      }
      Fs.readdir(path, function (err, files) {
        if (err) { return next(err); }
        if (path !== root) {
          files.unshift('..');
        }
        
        var data = new Array(files.length);
        var left = files.length;
        files.sort();
        files.forEach(function (file, index) {
          var fullPath = Path.join(path, file);
          var item = data[index] = {
            name: file
          };
          Fs.stat(fullPath, function (err, stat) {
            if (err) { return checkQueue(); }
            item.stat = stat;
            if (stat.isDirectory()) {
              item.isDirectory = true;
              item.name += "/";
            } else {
              item.mime = getMime(file);
            }
            checkQueue();
          });
        });
        function checkQueue() {
          left--;
          if (left > 0) { return; }
          var html = data.map(function (item) {
            return '<li' + (item.name[0] === '.' && item.name !== '..' ? ' class="hidden" ' : '') + '><a href="' + h(item.name) + '">' + h(item.name) + '</a></li>';
          }).join("\n");
          html = '<h1>' + h(path) + '</h1>\n' +
                 '<ul>' + html + '</ul>';
          if (!showHidden) {
            html = '<style>.hidden{display:none;}</style>\n' + html;
          }
          res.writeHead(200, {
            "Content-Type": "text/html", 
            "Content-Length": Buffer.byteLength(html)
          });
          res.end(html);
        }
      });
    });
  };
};

function renderIndex(root, files, callback) {
  getData(root, files, function (err, data) {
  });
}


function h(text) {
  return text.replace(/&/g, '&amp;').
              replace(/>/g, '&gt;').
              replace(/</g, '&lt;');
}

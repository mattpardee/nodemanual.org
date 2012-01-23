var Stack = require('stack'),
    Creationix = require('creationix'),
    Path = require('path');

var missingSlash = new RegExp("^/([a-z_0-9-]+|[0-9]+\.[0-9]+\.[0-9]+)(/[a-z_0-9-]+)*$");

module.exports = Stack(
  Creationix.postReceive("/post-receive", Path.join(__dirname, "/post-receive.sh")),
  function (req, res, next) {
    if (req.headers.host === "www.nodemanual.org") {
      res.writeHead(301, {Location: "http://nodemanual.org" + req.url});
      res.end();
      return;
    }
    if (req.url === "/") {
      res.writeHead(301, {Location: "/latest/"});
      res.end();
      return;
    }
    if (missingSlash.test(req.url)) {
      res.writeHead(301, {Location: req.url + "/"});
      res.end();
      return;
    }
    next();
  },
  Creationix.static("/", Path.join(__dirname, "out/"), "index.html"),
  Creationix.indexer("/", Path.join(__dirname, "out/"))
);




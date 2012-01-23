var Stack = require('stack'),
    Creationix = require('creationix'),
    Path = require('path');

module.exports = Stack(
  Creationix.postReceive("/post-receive", Path.join(__dirname, "/post-receive.sh")),
  function (req, res, next) {
    if (req.url === "/") {
      res.writeHead(301, {Location: "/latest/index.html"});
      res.end();
    } else {
      next();
    }
  },
  Creationix.static("/", Path.join(__dirname, "out/"), "index.html"),
  Creationix.indexer("/", Path.join(__dirname, "out/"))
);




var Stack = require('stack'),
    Creationix = require('creationix'),
    Path = require('path');

module.exports = Stack.compose(
  Creationix.postReceive("/post-receive", Path.join(__dirname, "/post-receive.sh")),
  Creationix.vhost({"nodemanual.org": function (req, res) {
    res.writeHead(200, {});  
    res.end("Coming soon...");
  }}),
  function (req, res, next) {
    if (req.url === "/") {
      res.writeHead(301, {Location: "/latest/nodejs_ref_guide"});
      res.end();
    } else {
      next();
    }
  },
  Creationix.static("/", Path.join(__dirname, "out/"), "index.html"),
  Creationix.indexer("/", Path.join(__dirname, "out/"))
);




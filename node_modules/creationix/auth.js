// Based loosly on basicAuth from Connect
// Checker takes username and password and returns a user if valid
// Will force redirect if requested over HTTP instead of HTTPS
module.exports = function basicAuth(checker, realm) {

  realm = realm || 'Authorization Required';
  
  function unauthorized(res) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="' + realm + '"',
      'Content-Length': 12
    });
    res.end("Unauthorized");
  }

  function badRequest(res) {  
    res.writeHead(400, {
      "Content-Length": 11
    });
    res.end('Bad Request');
  }

  return function(req, res, next) {
    // Check for non SSL connections
    if (!req.socket.encrypted) {
      var parts = req.headers.host.split(":");
      var host = parts[0];
      var port = parseInt(parts[1], 10);
      if (port !== 80) {
        port = port - (port % 1000) + 443;
        host = host + ":" + port;
      }
      var url = "https://" + host + req.realUrl;
      res.writeHead(301, {
        Location: url,
        "Content-Length": 0
      });
      res.end();
      return;
    }
    var authorization = req.headers.authorization;
    if (!authorization) return unauthorized(res);
    var parts = authorization.split(' ');
    var scheme = parts[0];
    var credentials = new Buffer(parts[1], 'base64').toString().split(':');
    if ('Basic' != scheme) return badRequest(res);
    var user = checker(req, credentials[0], credentials[1]);
    if (!user) return unauthorized(res);
    req.remoteUser = user;
    next();
  }
};


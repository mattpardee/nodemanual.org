var Url = require('url');
var ChildProcess = require('child_process');
var QueryString = require('querystring');

// Handler for github post-receive hooks
module.exports = function setup(mount, script, hook) {
  return function handle(req, res, next) {
    if (req.method !== "POST") return next();
    if (!req.hasOwnProperty("uri")) { req.uri = Url.parse(req.url); }
    if (req.uri.pathname !== mount) return next();
    var data = "";
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
      data += chunk;
    });
    req.on('end', function () {
      var message;
      try {
        data = QueryString.parse(data);
        message = JSON.parse(data.payload);
      } catch (err) {
        message = {};
      }
      ChildProcess.execFile(script, [], {}, function (err, stdout, stderr) {
        if (err) return next(err);
        var body = stdout + stderr;
        process.stdout.write(stdout);
        process.stderr.write(stderr);
        if (hook) hook();
        res.writeHead(200, {"Content-Length": Buffer.byteLength(body)});
        res.end(body);
      });
    });
  };
};


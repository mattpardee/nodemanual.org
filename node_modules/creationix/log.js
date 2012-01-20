// A super simple logging middleware
module.exports = function setup(special) {
  special = special || {
    "Content-Type": true,
    "Location": true,
    "Content-Length": true,
    "Content-Range": true,
  };
  return function handle(req, res, next) {
    var writeHead = res.writeHead;
    var start = Date.now();
    res.writeHead = function (code, headers) {
      var extra = [];
      if (headers) {
        Object.keys(headers).forEach(function (key) {
          if (special.hasOwnProperty(key)) {
            extra.push(key + "=" + headers[key]);
          }
        });
        if (!headers.hasOwnProperty('Date')) {
          headers.Date = (new Date()).toUTCString();
        }
        headers.Server = "NodeJS " + process.version;
        headers["X-Runtime"] = Date.now() - start;
      }
      console.log("%s %s %s %s", req.method, req.url, code, extra.join(" "));
      res.writeHead = writeHead;
      res.writeHead(code, headers);
    };
    next();
  };
};

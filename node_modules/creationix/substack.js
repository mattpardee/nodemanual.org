var URL = require('url');

function core(req, res, next) { next(); }

module.exports = function setup(mountPoint/*, layers*/) {

  // Calculate the SubStack
  var stack = core;
  Array.prototype.slice.call(arguments, 1).reverse().forEach(function (layer) {
    var child = stack;
    stack = function (req, res, next) {
      try {
        layer(req, res, function (err) {
          if (err) { return next(err); }
          child(req, res, next);
        });
      } catch (err) {
        next(err);
      }
    };
  });

  // Normalize the mountPoint
  if (mountPoint[mountPoint.length - 1] === "/") {
    mountPoint = mountPoint.substr(0, mountPoint.length - 1);
  }
  var matchPoint = mountPoint + "/";
  
  return function handle(req, res, next) {
    var url = req.url;
    
    if (url.substring(0, matchPoint.length) !== matchPoint) return next();
    // Modify the url
    if (!req.realUrl) req.realUrl = url;
    req.url = url.substr(mountPoint.length);
    req.uri = URL.parse(req.url);
    stack(req, res, function (err) {
      // Restore the url
      req.url = url;
      req.uri = URL.parse(req.url);
      next(err);
    });
  }

}


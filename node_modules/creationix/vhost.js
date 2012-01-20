
module.exports = function setup(domainHandlers, defaultHandler) {
  var domains = Object.keys(domainHandlers);
  var length = domains.length;
  return function handle(req, res, next) {
    var host = req.headers.host;
    var p = host.indexOf(":");
    if (p >= 0) host = host.substr(0, p);
    for (var i = 0; i < length; i++) {
      var domain = domains[i];
      if (domain !== host) continue;
      return domainHandlers[domain](req, res, next);
    }
    if (defaultHandler) return defaultHandler(req, res, next);
    next();
  };
};

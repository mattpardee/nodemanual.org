var Url = require("url");

module.exports = function setup(method, route, handler) {
  var names = [];
  var compiled = route.replace(/:[a-z$_][a-z0-9$_]*.?/gi, function (match) {
    if ((/[^a-z$_0-9]$/i).test(match)) {
      var end = match.substr(match.length - 1);
      names.push(match.substr(1, match.length - 2));
      return "([^" + end + "]+)" + end;
    }
    names.push(match.substr(1));
    return "(.*)";
  });
  compiled = "^" + compiled + "$";
  var regexp = new RegExp(compiled);
  return function (req, res, next) {
    if (req.method !== method) return next();
    if (!req.hasOwnProperty("uri")) { req.uri = Url.parse(req.url); }
    var match = req.uri.pathname.match(regexp);
    if (!match) return next();
    var params = {};
    Array.prototype.slice.call(match, 1).forEach(function (value, i) {
      params[names[i]] = value;
    });
    handler(req, res, params, next);
  }
};

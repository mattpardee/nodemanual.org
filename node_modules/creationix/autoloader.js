// TODO: Put in some sort of lock so that the same dep won't get loaded
// multiple times in parallel.
// TODO: Use etag or last-modified and/or keep stuff in memory for improved
// performance.
// The user will need to npm install ugilify-js on their own to use that option.

var Fs = require('fs'),
    Path = require('path'),
    Url = require('url'),
    QueryString = require('querystring');

var findAll = new RegExp("require\\(['\"][^\"']+['\"]\\)", "g");
var findName = new RegExp("require\\(['\"]([^\"']+)['\"]\\)");

module.exports = function setup(mount, folder, uglify) {

  if (uglify) {
    var jsp = require("uglify-js").parser;
    var pro = require("uglify-js").uglify;
  }

  return function handle(req, res, next) {
    if (!req.uri) { req.uri = Url.parse(req.url); }
    if (req.uri.pathname !== mount) return next();
    var names = req.uri.query.split(",").reverse();

    var has = {};
    var scripts = [];
    var header;
    
    function loadScript(name, callback) {
      if (!name) throw new Error("must provide name");
      if (has.hasOwnProperty(name)) return process.nextTick(callback);
      var path = Path.join(folder, name + ".js");
      Fs.readFile(path, 'utf8', function (err, js) {
        if (err) return callback(err);
        var matches = js.match(findAll);
        
        if (matches) {
          matches = Array.prototype.slice.call(matches).map(function (dep) {
            return dep.match(findName)[1];
          }).reverse();

          function getDep(err) {
            if (err) return next(err);
            var dep = matches.pop();
            if (!dep) return doneDeps();
            loadScript(dep, getDep);
          }
          getDep();
          
        } else {
          doneDeps();
        }
        function doneDeps() {
          if (!has[name]) { // Make sure only one version is in the generated JS
            has[name] = true;
            scripts.push([name, js]);
          }
          callback();
        }
        
      });
    }
    
    function getName(err) {
      if (err) return next(err);
      var name = names.pop();
      if (!name) return done();
      loadScript(name, getName);
    }
    Fs.readFile(__dirname + "/autoloader/bootstrap.js", 'utf8', function (err, js) {
      if (err) return next(err);
      header = js;
      getName();
    });
    
    function done(err) {
      var js = header;
      scripts.forEach(function (tuple) {
        var name = tuple[0];
        var content = tuple[1];
        js += "\ndefine('" + name + "', function (module, exports) {\n\n" + content + "\n})\n";
      });
      
      if (uglify) {
        var ast = jsp.parse(js); // parse code and get the initial AST
        ast = pro.ast_mangle(ast); // get a new AST with mangled names
        ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
        js = pro.gen_code(ast); // compressed code here
      }
      
      res.writeHead(200, {
        "Content-Type": "application/javascript",
        "Content-Length": Buffer.byteLength(js)
      });
      res.end(js);
    }
  };
};


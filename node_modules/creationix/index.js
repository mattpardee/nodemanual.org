require('fs').readdirSync(__dirname).forEach(function (name) {
  if (name !== 'index.js' && name.substr(name.length-3) === ".js") {
    var name = name.substr(0, name.length - 3);
    Object.defineProperty(exports, name, {get: function () {
      return require("./" + name);
    }, enumerable: true});
  }
});


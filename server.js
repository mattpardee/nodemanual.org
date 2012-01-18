var Http = require('http');
var Stack = require('stack');
var Creationix = require('creationix');
Http.createServer(Stack(
  Creationix.log(),
  require('./app')
)).listen(4000);
console.log("Serving files at http://localhost:4000/");

#!/usr/bin/env node

var Http = require('http'),
    Stack = require('stack'),
    Creationix = require('creationix');
var path = process.cwd();

var handler = Stack(
  Creationix.log(),
  Creationix.static('/', path, 'index.html'),
  Creationix.indexer('/', path)
);
var PORT = 8080;
function listen() {
  try {
    Http.createServer(handler).listen(PORT);
    console.log("Serving %s at http://localhost:%s/", path, PORT);
  } catch (err) {
    // this is probably broken in node 0.5.x. Should check err.code instead.
    if (err.errno !== 98) { throw err; }
    PORT++;
    listen();
  }
}
listen();

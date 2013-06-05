var HTTP = require('http');
var FS = require('fs');

var handle = require('./app');

// Detect if we're running as root or not
var isRoot = !process.getuid();

// Set some common variables
var PORT = process.env.PORT || 8000;

HTTP.createServer(handle).listen(PORT, "0.0.0.0");
process.title ="nodemanual.org";
console.log("Server %s listening at http://localhost" + (PORT === 80 ? "" : ":" + PORT) + "/", process.title);

if (isRoot) {
  // Lets change to the owner of this file, whoever that may be
  var stat = FS.statSync(__filename);
  console.log("Changing gid to " + stat.gid);
  process.setgid(stat.gid);
  console.log("Changing uid to " + stat.uid);
  process.setuid(stat.uid);
}


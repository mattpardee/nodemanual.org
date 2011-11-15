require("colors");
var argv = require("optimist").argv,
    path = require("path"),
    docs = require("./docs");
var task = argv._[0];
var type = argv._[1];
switch (task) {
case "b":
    console.log("GENERATING DOCUMENTATION".yellow);
    docs.clean("tmp");
    docs.clean("out");
    docs.copyassets("nodejs_dev_guide");
    docs.generate("nodejs_dev_guide");
    break;
case "s":
    console.log("SERVING DOCUMENTATION".yellow);

    var HTTPServer = require("http-server").HTTPServer;
    var httpServer = new HTTPServer({root: "./out", port: process.env.PORT});

    httpServer.start();

    process.on("SIGINT", function() {
      httpServer.log("doc-server stopped.".red);
      return process.exit();
    });
    
    break;
default:
    console.log("Invalid command!".red + "\n");
    console.log("You may either:" + "\n");
    console.log("* 'b'uild the docs" + "\n");
    console.log("* 's'erve the docs" + "\n");
    break;
}
require("colors");

var argv = require("optimist").argv,
    docs = require("./docs");
    
var task = argv._[0],
    type = argv._[1],
    version = argv._[2];

var latest = "0.6.3";

switch (task) {
case "b":
    console.log("GENERATING DOCUMENTATION".green);
    if (type == "nodejs_ref_guide")
    {
        if ("latest" == version)
        {
            version = latest;
        }
        else if (!/[\d]\.[\d]\.[\d]/.test(version))
        {
            console.log("You specified that you want to build the nodejs_ref_guide, but you didn't specify a version! I'll assume you just wanted the latest...".red + "\n\nIf you didn't want to do that, you must add a third parameter that matches x.y.z, where x, y, and z are all numerals; for example, 0.6.3. You can also just pass in the word latest for the latest version.".red);
            
            version = latest;
        }
        
        type += "/v" + version;
    }
    
    docs.clean("tmp");
    docs.clean("out");
    docs.copyassets(type);
    docs.generate(type);
    break;
case "s":
    console.log("SERVING DOCUMENTATION".green);

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
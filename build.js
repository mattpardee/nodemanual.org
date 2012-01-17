require("colors");

var argv = require("optimist").argv,
    docs = require("./build/doc-build/docs"),
    fs = require('fs');
    
var task = argv._[0],
    version = argv._[1];

var type = "nodejs_dev_guide";
var outDir = "out/nodejs_dev_guide";

var latest = "0.6.7";

var versionError;

switch (task) {
case "b":
    console.log("GENERATING DOCUMENTATION".green);
    
    docs.clean("tmp");
    docs.clean("out");
    docs.clean(outDir);
    docs.copyassets(outDir, type);
    docs.generate(outDir, process.cwd() + "/src/" + type, type);

    var util = require('util'),
        exec = require('child_process').exec,
        child;

    exec('node ./build/ndoc/bin/ndoc --path=./src/js_doc -o ./out/js_doc -t "Javascript Reference" --skin ./resources/nodejs_ref_guide/skins',
      function (error, stdout, stderr) {
        console.log(stdout);

        if (error !== null) {
            var errMsg = 'exec error: ' + error;
            console.log(errMsg.red);
            process.exit(1);
        }
    });

    ls = exec('ls ./src/nodejs_ref_guide');
    ls.stdout.on('data', function (data) {
        var versions = [];
        if ("latest" == version)
        {
            versions.push("latest");
        }
        else if (/[\d]\.[\d]\.[\d]/.test(version))
        {         
            versions.push("v" + version);
        }
        else
        {
            versionError = "We're building the documentation for Node.js, but you didn't specify a version! You must either: \n" +
                    " * Add a parameter that matches x.y.z, where x, y, and z are all numerals; for example, 0.6.3\n" +
                    " * Pass in the word 'latest' for the latest version; currently, this is " + latest + "\n" +
                    "I'll just build all of them, then...";

            versions = data.split("\n");
            versions.pop();
            //console.log(versions);
        }  

        versions.forEach(function (element, index, array)
        {
            exec('node ./build/ndoc/bin/ndoc --path=./src/nodejs_ref_guide/' + array[index] + ' -o ./out/nodejs_ref_guide/' + array[index] + ' -t "Node.js Reference" --skin ./resources/nodejs_ref_guide/skins',
                function (error, stdout, stderr) {
                
                console.log(stdout);
                
                if (error !== null) {
                    var errMsg = 'exec error: ' + error;
                    console.log(errMsg.red);
                    process.exit(1);
                }

                if (index == array.length - 1)
                    console.log(versionError.red);
            });
        });      
    });
    break;

case "s":
    console.log("SERVING DOCUMENTATION".green);

    var HTTPServer = require("http-server").HTTPServer;
    var httpServer = new HTTPServer({root: "./out", port: 1337});

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

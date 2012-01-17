require("colors");

var argv = require("optimist").argv,
    docs = require("./build/doc-build/docs"),
    fs = require('fs');
    
var version = argv._[0];

var type = "nodejs_dev_guide";
var outDir = "out/nodejs_dev_guide";

var latest = "0.6.7";

var versionError;

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
            versions = data.split("\n");
            versions.pop(); // remove bogus "." dir
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
                    console.log("All Done!".green);
            });
        });      
    });
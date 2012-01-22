require("colors");

var argv = require("optimist").argv,
    docs = require("./build/doc-build/docs"),
    fs = require('fs');
    
var version = argv._[0];
var versions = [];
var latest = "0.6.8";

//var outDir = "out/nodejs_dev_guide";


    console.log("GENERATING DOCUMENTATION".green);

    var util = require('util'),
        exec = require('child_process').exec,
        child;

    ls = exec('ls ./src/');
    ls.stdout.on('data', function (data) {
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

        makeManualDocs(versions);
        makeJSRefDocs(versions);
       makeNodeJSRefDocs(versions);        
    });

function makeManualDocs(versions)
{
        versions.forEach(function (element, index, array)
        {
            var outDir = "out/" + element;

            docs.clean("tmp");
            docs.clean(outDir + "/nodejs_dev_guide");

            docs.copyassets(outDir, "nodejs_dev_guide");
            docs.generate(outDir + "/nodejs_dev_guide", process.cwd() + "/src/" + element + "/nodejs_dev_guide/", "nodejs_dev_guide");

            // don't forget the index! 
            //docs.generate(outDir, process.cwd() + "/src/" + element + "/index.md", "nodejs_dev_guide");

        });    
}

function makeJSRefDocs(versions)
{
        versions.forEach(function (element, index, array)
        {
            exec('node ./build/ndoc/bin/ndoc --path=./src/' + element + '/js_doc -o ./out/' + element + '/js_doc/' + ' -t "Node.js Reference" --skin ./resources/nodejs_ref_guide/skins',
                function (error, stdout, stderr) {
                
                console.log(stdout);
                
                if (error !== null) {
                    var errMsg = 'exec error: ' + error;
                    console.log(errMsg.red);
                    process.exit(1);
                }
            });
        });   
}

function makeNodeJSRefDocs(versions)
{
        versions.forEach(function (element, index, array)
        {
            exec('node ./build/ndoc/bin/ndoc --path=./src/' + element + '/nodejs_ref_guide -o ./out/' + element + '/nodejs_ref_guide/' + ' -t "Node.js Reference" --skin ./resources/nodejs_ref_guide/skins',
                function (error, stdout, stderr) {
                
                console.log(stdout);
                
                if (error !== null) {
                    var errMsg = 'exec error: ' + error;
                    console.log(errMsg.red);
                    process.exit(1);
                }

                if (index == array.length - 1)
                {
                    console.log("All Done!".green);
                    process.exit(0);
                }
            });
        }); 
}
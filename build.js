var argv = process.argv,
    panino = require("panino"),
    fs = require('fs'),
    md2html = require('marked'),
    jade = require('jade'),
    panda = require("panda-docs"),
    path  = require('path'), 
    wrench = require('wrench'),
    funcDoc = require('functional-docs'),
    path = require("path"),
    exec = require('child_process').exec;
    
argv.shift();
argv.shift();

var versionToBuild = argv[0] || "empty";
var jadeTemplateFile = "resources/landing/layout.jade";
var jadeTemplate = fs.readFileSync(jadeTemplateFile);

var jadeVersionsList = fs.readFileSync("resources/versionsList.jade");
var jadeCommonLayout = fs.readFileSync("resources/common_layout.jade");

console.log("GENERATING DOCUMENTATION");

fs.readdir("./src", function(err, files) {
    // whatever the last folder (alphabetically) is == latest version
    var sourceFiles = wrench.readdirSyncRecursive('./src').sort();
    var latestVersion = sourceFiles[sourceFiles.length - 3].split("/")[0]; // -3, to skip index.md

    // we didn't pass in a specific version, assume only last in dir
    if (!/[\d]\.[\d]\.[\d]/.test(versionToBuild)) {   
        versionToBuild = latestVersion;
        createSymlinkToLatest(versionToBuild, function() {
            buildDocs(versionToBuild);
        })
    }
    else { // otherwise, we're doing a specific build
        buildDocs(versionToBuild);
    }
});

function createSymlinkToLatest(latestVersion, callback) {
    var relativeOut = path.resolve("./out") + "/";

    wrench.mkdirSyncRecursive(relativeOut +  latestVersion);
    if (/0\.6\.\d+/.test(process.version)) {
       exec("ln -fs " + relativeOut +  latestVersion + " " + relativeOut + "latest", function (error, stdout, stderr) {
            if (error) {
                console.error(stdout)
                process.exit(1);
            }

            callback();
        });
    }
    else if (/0\.8\.\d+/.test(process.version)) {
       // do something else via fs.symlink
    }
}

function buildDocs(verj) {
    var outAssetsDir = "./out/" + verj + "/assets";
    makeNodeJSRefDocs(verj, outAssetsDir);  
    
    var robotFile = fs.createReadStream("resources/robots.txt");
    robotFile.pipe(fs.createWriteStream("out/robots.txt"));
}

function makeNodeJSRefDocs(verj, outAssetsDir) {
    panino.main(["--path=./src/" + verj + "/nodejs_ref_guide", "-s", "-d", "-e", "markdown", "-g", "javascript", "-f", "html", "-p", "./parseOptions.json", "-a", "./additionalObjs.json", "-o", "./out/" + verj + "/nodejs_ref_guide", "-t", "Node.js Reference Guide", "--skin", "./resources/nodejs_ref_guide/skins", "-u", outAssetsDir], function(err) {
        if (err) {
            console.error(err);
            process.exit(-1);
        }
        
        makeJSRefDocs(verj, outAssetsDir);
    });
}

function makeJSRefDocs(verj, outAssetsDir) {
    panino.main(["--path=./src/" + verj + "/js_doc", "-s", "-d", "-e", "markdown", "-g", "javascript", "-f", "html", "-a", "./additionalObjs.json", "-o", "./out/" + verj + "/js_doc/", "-t", "Javascript Reference", "--skin", "./resources/nodejs_ref_guide/skins", "-u", outAssetsDir], function(err) {
        if (err) {
            console.error(err);
            process.exit(-1);
        }
        
        makeDevDocs(verj, outAssetsDir);
    });
}

function makeDevDocs(verj, outAssetsDir) {
    var outDir = "./out/" + verj + "/nodejs_dev_guide";
    var manifestFile = "./src/" + verj + "/nodejs_dev_guide/manifest.json";

    if (!path.existsSync(outDir)) {
        wrench.mkdirSyncRecursive(outDir);
    }
    
    panda.make([manifestFile, "--template", "./resources/nodejs_dev_guide/layout.jade", "--assets", "./resources/nodejs_dev_guide/skins", "-d", "-t", "Node.js Guide", "-o", outDir, "--outputAssets", outAssetsDir], function(err) {
        if (err) {
            console.error(err);
            process.exit(-1);
        }
        
        makeIndexes(verj);
    });
}

function makeIndexes(verj) {
    var readContentStream = fs.createReadStream("src/index.md", {
        encoding: 'utf8'
    });

    readContentStream.on('data', function(data) {
        var fn = jade.compile(jadeTemplate, {
            filename: jadeTemplateFile,
            pretty: false
        });

        var dataArray = data.split("\n");

        var title = "";
        var data = dataArray.join("\n");

        var vars = extend({
            title: "Node.js Manual",
            data: data,
            whoAmI: verj,
            markdown: markdown,
            isIndex: true,
            fileName: "Index"
        });

        var r = fn(vars);

        var writeStream = fs.createWriteStream("out/" + verj + "/index.html", {
            flags: "w"
        });

        writeStream.write(r);
        
       /* funcDoc.runTests([ './out/' + verj], {stopOnFail: false, ext: ".html"}, function(err) {
            if (err)
                console.log(err);
            console.log("All done!");
        });*/
    });
}

// helpers

function markdown(text) {
    return md2html(text);
}

function extend(o, plus) {
    var r = {},
        i;
    for (i in o) {
        if (o.hasOwnProperty(i)) {
            r[i] = o[i];
        }
    }
    if (plus) {
        for (i in plus) {
            if (plus.hasOwnProperty(i)) {
                r[i] = plus[i];
            }
        }
    }

    return r;
}
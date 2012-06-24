var argv = process.argv,
    panino = require("panino"),
    fs = require('fs'),
    md2html = require('marked'),
    jade = require('jade'),
    panda = require("panda-docs"),
    path  = require('path'), 
    wrench = require('wrench'),
    funcDoc = require('functional-docs');
    
argv.shift();
argv.shift();

var version = argv[0];
var versions = [];
var jadeTemplateFile = "resources/landing/layout.jade";
var jadeTemplate = fs.readFileSync(jadeTemplateFile);

//var outDir = "out/nodejs_dev_guide";

console.log("GENERATING DOCUMENTATION");

fs.readdir("./src", function(err, files) {
    if (/[\d]\.[\d]\.[\d]/.test(version)) {         
        versions.push(version);
    }
    else if ("latest" == version || version === undefined) {
        versions.push("latest");
    }
    /* builds everything...we don't want this anymore
    else {
        versions = files;
        versions = versions.filter(function (value) {
            return (value === '' || value == "index.md" || value.match(/^\./)) ? 0 : 1;
        });
    } */
    
    versions.forEach(function(verj) {
        var outAssetsDir = "./out/" + verj + "/assets";
        makeNodeJSRefDocs(verj, outAssetsDir);  
    });

    var robotFile = fs.createReadStream("resources/robots.txt");
    robotFile.pipe(fs.createWriteStream("out/robots.txt"));
});

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
        
        /*funcDoc.runTests([ './out/' + verj], {stopOnFail: false, ext: ".html"}, function(err) {
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
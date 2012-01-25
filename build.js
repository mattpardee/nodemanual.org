require("colors");

var argv = require("optimist").argv,
    docs = require("./build/doc-build/docs"),
    ndoc = require("./build/ndoc/bin/ndoc"),
    fs = require('fs'),
    md2html = require('marked'),
    jade = require('jade');
    
var version = argv._[0];
var versions = [];

console.log("GENERATING DOCUMENTATION".green);

fs.readdir("./src", function(err, files) {
    if ("latest" == version) {
        versions.push("latest");
    }
    else if (/[\d]\.[\d]\.[\d]/.test(version)) {         
        versions.push("v" + version);
    }
    else {
        versions = files;
        versions = versions.filter(function (value) {
            return (value === '' || value == "index.md") ? 0 : 1;
        });
    }
    
    makeManualDocs(versions);
    makeJSRefDocs(versions);
    makeNodeJSRefDocs(versions);        
});


function makeManualDocs(versions) {
    versions.forEach(function (element, index, array) {
        var outDir = "out/" + element;
        var tmpDir = "tmp/" + element;

        docs.clean(tmpDir + "/nodejs_dev_guide");
        docs.clean(outDir + "/nodejs_dev_guide");

        docs.copyassets(outDir, "nodejs_dev_guide");
        docs.generate(outDir + "/nodejs_dev_guide", process.cwd() + "/src/" + element + "/nodejs_dev_guide/", "nodejs_dev_guide");

        makeIndexes(element);
    });    
}

function makeIndexes(version) {
    var jadeTemplateFile = "resources/landing/layout.jade";
    var jadeTemplate = fs.readFileSync(jadeTemplateFile);

    var readContentStream = fs.createReadStream("src/index.md", {encoding: 'utf8'});

    readContentStream.on('data', function (data) {
        var fn = jade.compile(jadeTemplate, {filename: jadeTemplateFile, pretty: false});

        var dataArray = data.split("\n");

        var title = "";
        var data = dataArray.join("\n");

        var vars = extend({
            title: title,
            data: data,
            whoAmI: version,
            markdown: markdown
        });

        var r = fn(vars);
        
        var writeStream = fs.createWriteStream("out/" + version + "/index.html", {flags: "w"});
                
        writeStream.write(r);
    });    
}

function makeJSRefDocs(versions) {
    versions.forEach(function (element, index, array) {
        ndoc.main(["--path=./src/" + element + "/js_doc", "-o", "./out/" + element + "/js_doc/", "-t", "Node.js Reference", "--skin", "./resources/nodejs_ref_guide/skins"], function(err) {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
        });
    });
}

function makeNodeJSRefDocs(versions) {
    versions.forEach(function (element, index, array) {
        ndoc.main(["--path=./src/" + element + "/nodejs_ref_guide", "-o", "./out/" + element + "/nodejs_ref_guide/", "-t", "Node.js Reference", "--skin", "./resources/nodejs_ref_guide/skins"], function(err) {
            if (err) {
                console.error(err);
                process.exit(-1);
            }
        });
    });
}

function markdown(text) {
    return md2html(text);
}

function extend(o, plus) {
    var r = {}, i;
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
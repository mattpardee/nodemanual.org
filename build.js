require("colors");

var argv = require("optimist").argv,
    docs = require("./build/doc-build/docs"),
    ndoc = require("./build/ndoc/bin/ndoc"),
    fs = require('fs'),
    md2html = require('marked'),
    jade = require('jade');

var version = argv._[0];
var versions = [];
var jadeTemplateFile = "resources/landing/layout.jade";
var jadeTemplate = fs.readFileSync(jadeTemplateFile);

//var outDir = "out/nodejs_dev_guide";

console.log("GENERATING DOCUMENTATION".green);

fs.readdir("./src", function(err, files) {
    if ("latest" == version) {
        versions.push("latest");
    }
    else if (/[\d]\.[\d]\.[\d]/.test(version)) {         
        versions.push(version);
    }
    else {
        versions = files;
        versions = versions.filter(function (value) {
            return (value === '' || value == "index.md" || value.match(/^\./)) ? 0 : 1;
        });
    }

    versions.forEach(function(verj, index, array) {
        makeJSRefDocs(verj);
        //makeManualDocs(verj);
    });

    var robotFile = fs.createReadStream("resources/robots.txt");
    robotFile.pipe(fs.createWriteStream("out/robots.txt"));
});

function makeManualDocs(verj) {

    var outDir = "out/" + verj;
    var tmpDir = "tmp/" + verj;

    docs.clean(tmpDir + "/nodejs_dev_guide");
    //docs.clean(outDir + "/nodejs_dev_guide");

    //docs.copyassets(outDir, "nodejs_dev_guide");
    docs.generate(outDir + "/nodejs_dev_guide", process.cwd() + "/src/" + verj + "/nodejs_dev_guide/", "nodejs_dev_guide", makeIndexes(verj));
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
            title: title,
            data: data,
            whoAmI: verj,
            markdown: markdown
        });

        var r = fn(vars);

        var writeStream = fs.createWriteStream("out/" + verj + "/index.html", {
            flags: "w"
        });

        writeStream.write(r);
    });

    /*
    readContentStream.on('close', function() {
        makeJSRefDocs(verj);
    }); */
}

function makeJSRefDocs(verj) {
    ndoc.main(["--path=./src/" + verj + "/js_doc", "-j", "http://www.nodemanual.org/" + verj + "/js_doc/%s.html", "-e", "md", "-o", "./out/" + verj + "/js_doc/", "-t", "Node.js Reference", "--skin", "./resources/nodejs_ref_guide/skins"], function(err) {
        if (err) {
            console.error(err);
            process.exit(-1);
        }

       makeNodeJSRefDocs(verj);
    });
}

function makeNodeJSRefDocs(verj) {
    ndoc.main(["--path=./src/" + verj + "/nodejs_ref_guide", "-j", "http://www.nodemanual.org/" + verj + "/js_doc/%s.html", "-e", "md", "-o", "./out/" + verj + "/nodejs_ref_guide/", "-t", "Node.js Reference", "--skin", "./resources/nodejs_ref_guide/skins"], function(err) {
        if (err) {
            console.error(err);
            process.exit(-1);
        }

        makeManualDocs(verj);
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
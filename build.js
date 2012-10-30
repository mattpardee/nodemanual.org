var argv = process.argv,
    panino = require("panino"),
    fs = require('fs'),
    panda = require("panda-docs"),
    path  = require('path'), 
    wrench = require('wrench'),
    funcDoc = require('functional-docs'),
    semver = require('semver'),
    exec = require('child_process').exec;
    
argv.shift();
argv.shift();

var versionToBuild = argv[0] || "empty";

var jadeVersionsList = fs.readFileSync("resources/versionsList.jade");
var jadeCommonLayout = fs.readFileSync("resources/common_layout.jade");

var buildOptions = {
  split       : true,
  disableTests : true,
  skin        : "./resources/nodejs_ref_guide/skins/templates/layout.jade",
  assets      : "./resources/nodejs_ref_guide/skins/assets",
  additionalObjs : "./additionalObjs.json",
  parseOptions   : "./parseOptions.json"
};

console.log("GENERATING DOCUMENTATION");

fs.readdir("./src", function(err, files) {
    // whatever the last folder is == latest version
    var sourceFiles = wrench.readdirSyncRecursive('./src').sort();
    var versions = sourceFiles.filter(function(dir){
        if (dir.indexOf("/") < 0 && semver.valid(dir))
            return true;
        return false;
    });

    // reverse sort to pluck first one
    var latestVersion = versions.sort(function(a, b){
        if (semver.gt(a, b))
            return -1;
        else
            return 1;
    })[0];

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
    var symlinkPath = relativeOut + "latest";

    exec("rm -f " + symlinkPath + " && ln -s " + relativeOut + latestVersion + " " + symlinkPath, function (error, stdout, stderr) {
         if (error) console.error(stdout || error);

         callback();
     });
}

function buildDocs(verj) {
    var outAssetsDir = "./out/" + verj + "/assets";
    buildOptions.outputAssets = outAssetsDir;
    makeNodeJSRefDocs(verj);  
    
    var robotFile = fs.createReadStream("resources/robots.txt");
    robotFile.pipe(fs.createWriteStream("out/robots.txt"));
}

function makeNodeJSRefDocs(verj) {
    buildOptions.output = "./out/" + verj + "/nodejs_ref_guide";
    buildOptions.title = "Node.js Reference Guide";

    panino.parse(["./src/" + verj + "/nodejs_ref_guide"], buildOptions, function (err, ast) {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      panino.render('html', ast, buildOptions, function (err) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        makeJSRefDocs(verj);
      });
    });
}

function makeJSRefDocs(verj) {
    buildOptions.output = "./out/" + verj + "/js_doc";
    buildOptions.title = "Javascript Reference";
    buildOptions.parseOptions = undefined; // not needed here

    panino.parse(["./src/" + verj + "/js_doc"], buildOptions, function (err, ast) {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      panino.render('html', ast, buildOptions, function (err) {
        if (err) {
          console.error(err);
          process.exit(1);
        }

        makeDevDocs(verj);
      });
    });
}

function makeDevDocs(verj) {
    var outDir = "./out/" + verj + "/nodejs_dev_guide";

    buildOptions.skin = "./resources/nodejs_dev_guide/layout.jade";
    buildOptions.assets = "./resources/nodejs_dev_guide/skins";
    buildOptions.title = "Node.js Guide";
    buildOptions.output = outDir;
    buildOptions.codeHighlightTheme = "idea";

    panda.make(["./src/" + verj + "/nodejs_dev_guide/index.md", 
                "./src/" + verj + "/nodejs_dev_guide/overview", 
                "./src/" + verj + "/nodejs_dev_guide/reference", 
                "./src/" + verj + "/nodejs_dev_guide/tutorial"], buildOptions, function(err) {
        if (err) {
            console.error(err);
            process.exit(-1);
        }
        
        makeIndexes(verj);
    });
}

function makeIndexes(verj) {
    var outDir = "./out/" + verj;

    buildOptions.skin = "resources/landing/layout.jade";
    buildOptions.title = "Node.js Manual";
    buildOptions.output = outDir;
    buildOptions.keepOutDir = true;
    buildOptions.disableTests = false; // run tests on final output

    panda.make(["./src/index.md"], buildOptions, function(err) {
        if (err) {
            console.error(err);
            process.exit(-1);
        }
        
        console.log("All done!");
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
var docs = {},
    path = require('path'),
    fs = require('fs'),
    gfm = require("github-flavored-markdown"),
    wrench = require('wrench');

// JSON of the toc file order; contains:
// name: parent directory name
// content: file contents
// directory: the full directory path
// metadata: location of any metadata file
// outname: what the final output file should be named

var fileOrder = new Array(1);

var tocHTML = "";

docs = exports;

docs.generate = exports.generate = function (type) {
    var toc;

    try {
        toc = JSON.parse(fs.readFileSync("src/" + type + "/toc.json")).toc;
    }
    catch (err) {
        console.log("There was an error parsing the JSON TOC for " + tocFile + ": " + err);
    }

    for (var i = 0; i < toc.length; i++) {
        storeTOCInfo(toc[i].name, combineToc(i, "src/" + type, toc[i]), toc[i].metadata, toc[i].outname);
    }

    var files = fileOrder.filter(function (value) {
        return (value === undefined) ? 0 : 1;
    });
    fileOrder = [];

    printContents(0, type, files);
};

function combineToc(i, prefix, toc) {
    if (toc.content !== undefined) {
        for (var j = 0; j < toc.content.length; j++) {
            var name = "/" + toc.name + "/";
            
            if (toc.name === undefined)
                name = "/";
                
            var contentFile = prefix + name + toc.content[j];
            storeTOCInfo(toc.name, contentFile, toc.metadata, toc.outname);
        }
    }

    if (toc.folder !== undefined) {
        for (var k = 0; k < toc.folder.length; k++) {
            storeTOCInfo(toc.folder[k].name, combineToc(i, prefix + "/" + toc.name, toc.folder[k], fileOrder), toc.folder[k].metadata, toc.outname);
        }
    }
}

function storeTOCInfo(dirName, fileContent, fileMetadata, outname) {
    if (fileContent !== undefined) {
        var srcDir = fileContent.substring(0, fileContent.lastIndexOf("/"));
        fileOrder.push({
            name: dirName,
            content: fileContent,
            directory: srcDir,
            metadata: srcDir + "/" + fileMetadata,
            outname: outname
        });
    }
}

function printContents(i, type, files) {
    // while there's still data, put it all together
    if (i < files.length) {
        var splitPaths = files[i].directory.split(type),
            destFile;

        // for sub-directories, like npm/foo, we want foo 
        // to be placed into npm.md as a long file
        if (splitPaths.length > 2) 
        {
            var fileName = splitPaths[2];
            
            if (fileName != "") destFile = "tmp/" + splitPaths[2] + ".md";
            else destFile = "tmp/" + files[i].content.substring(files[i].content.lastIndexOf("/") + 1, files[i].content.lastIndexOf(".")) + ".md";
        }
        else if (files[i].name === undefined) 
        {
            if (files[i].outname !== undefined)
            {
                destFile = "tmp/" + files[i].outname + ".md";
            }
            else
                destFile = "tmp/" + files[i].content.substring(files[i].content.lastIndexOf("/") + 1);
        }
        else
            destFile = "tmp/" + files[i].name + ".md";
        
        //console.log(destFile);
        traverse(files[i], destFile, function (err) {
            if (err) console.log("Error printing contents: " + err);
            else printContents(i + 1, type, files, destFile);
        });
    }
    else { // no more? then turn the *.md files into HTML
        tocHTML += "</ul></div>";
        require('findit').find("tmp", function (file) {
            docs.assemble(type, file);
        });
    }
}

function traverse(files, destFile, cb) {
    var contentFile = files.content;
    var metadataFile = files.metadata;

    path.exists(contentFile, function (exists) {
        if (exists) {
            var readStream = fs.createReadStream(contentFile);
            var writeStream = fs.createWriteStream(destFile, {
                flags: "a+"
            });

            readStream.addListener("data", function (chunk) {
                var lines = chunk.toString().split('\n');
                var title = lines[0]; // save first line for additional processing
                lines.splice(0, 1);
                var cleanChunk = lines.join('\n');

                var metadata;

                path.exists(metadataFile, function (exists) {
                    var slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-').substring(1);
                    var idLink = "<a class=\"hiddenLink\" id=\"" + slug + "\"></a>";
                    var byline;

                    if (exists) {
                        try {
                            metadata = JSON.parse(fs.readFileSync(metadataFile));
                        }
                        catch (err) {
                            console.log("There was an error parsing the JSON metadata for " + metadataFile + ": " + err);
                        }

                        byline = "<span class=\"cite\">by " + metadata.author + " (Last Updated: " + metadata.date + ")</span>";
                    }
                    else byline = "";

                    var destFileName = destFile.substring(4, destFile.lastIndexOf("."));
                    if (title.match("^# ")) {
                        if (tocHTML != "") tocHTML += "</ul>\n</div>\n";

                        tocHTML += "<h5>" + title.substring(title.indexOf(" ") + 1) + "</h5>\n<div>\n<ul>\n";
                        //tocHTML += "<h3><a class=\"header\" href=\"#\">" + title.substring(title.indexOf(" ") + 1) + "</a></h3>\n<div>\n<ul>\n";                  
                    }
                    else if (title.match("^## ")) {
                        tocHTML += "<li><a class=\"upper\" href=\"" + destFileName + ".html" + "\">" + title.substring(title.indexOf(" ") + 1) + "</a></li>\n";
                    }
                    else if (title.match("^### ")) {
                        //tocHTML += "<li class=\"inner\"><a href=\"" + destFileName + ".html" + "#" + slug + "\" class=\"" + destFileName + "_hide\">" + title.substring(title.indexOf(" ") + 1) + "</a></li>\n";
                    }

                    title = idLink + "\n\n" + title + "\n" + byline + "\n\n";
                    var divPieceStart = "\n\n&ltdiv class=\"hero-unit\">\n\n";
                    var divPieceEnd = "&lt/div>\n";
                    writeStream.write(divPieceStart + title + cleanChunk + divPieceEnd);
                });
            });

            readStream.addListener("end", function () {
                cb(null); // go on to the next file
            });
        }
        else {
            console.log(("Warning: " + contentFile + " does not exist.").yellow);
            cb(null);
        }
    });
}

docs.assemble = function (outName, tmpFile) {
    var filename = tmpFile.substring(3, tmpFile.lastIndexOf("."));
    var outTmpFile = "tmp/" + filename + ".html";
    var outFile = "out/" + outName + "/" + filename + ".html";
    var headerFile, footerFile;
    
    if (outName.indexOf("/") >= 0)
    {
        var type = outName.substring(0, outName.indexOf("/"));
        headerFile = "build/" + type + "_header.html";
        footerFile = "build/" + type + "_footer.html";
    }
    else
    {
        headerFile = "build/" + outName + "_header.html";
        footerFile = "build/" + outName + "_footer.html";  
    }



    var readHeaderStream = fs.createReadStream(headerFile);
    var writeStream = fs.createWriteStream(outTmpFile, {
        flags: "a+"
    });

    readHeaderStream.on('open', function () {
        readHeaderStream.pipe(writeStream, {
            end: false
        });
    });

    readHeaderStream.on('end', function () {
        // create sidebar toc semi-dynamically
        // this is probably the worst way to do this   
        writeStream.write(tocHTML);
        // close up toc, start content writing
        writeStream.write("\n</div>\n</div>\n<div class=\"content\">");

        var readTmpStream = fs.createReadStream(tmpFile);

        readTmpStream.on('data', function (data) {
            // initial md->html conversion
            writeStream.write(gfm.parse(data.toString()));
        });

        readTmpStream.on('end', function () {
            var readFooterStream = fs.createReadStream(footerFile);
            readFooterStream.pipe(writeStream);

            readFooterStream.on('end', function () {

                var readTmpHTMLStream = fs.createReadStream(outTmpFile);
                var writeFinalStream = fs.createWriteStream(outFile, {
                    flags: "a+"
                });

                readTmpHTMLStream.on('data', function (data) {

                    var content = data.toString();
                    
                    if (outName == "nodejs_ref_guide") 
                        content = jsdocReplacements(content);

                    // Markdown doesn't work inside block elements, so we need
                    // to re-run and replace elements
                    content = content.replace(new RegExp("&amp;lt", 'g'), "<");
                    writeFinalStream.write(content);
                });
            });
        });
    });
}

function jsdocReplacements(content) {
    var lines = content.split("\n");

    for (var i = 0; i < lines.length; i++)
    if (lines[i].indexOf("@event") >= 0) {
        var unbrokenLine = lines[i].replace("<p>", "").replace("</p>", "").split("<br />");

        var eventHeader = "<h4 class=\"eventHeader\">" + unbrokenLine[0].substring("@event".length) + "</h4>";
        var lParamsList = "<div class=\"listenerParam\"><h5>Listener Parameters</h5><ul>";
        var lParamsParamsList = "<div class=\"listenerParamParam\"><h6>Parameters</h6><ul>"

        for (var j = 1; j < unbrokenLine.length; j++) {
            var params = unbrokenLine[j].split(",");
            lParamsList += "<li>" + params[0].substring("@cb ".length);

            if (params.length > 1) {
                lParamsList += lParamsParamsList;

                for (var k = 1; k < params.length; k++) {
                    lParamsList += "<li>" + params[k] + "</li>";
                }
                lParamsList += "</ul>";
            }

            lParamsList += "</li>";
        }

        lParamsList += "</ul>";

        lines[i] = "<p>" + eventHeader + lParamsList + "</p>";
    }
    else if (lines[i].indexOf("@method") >= 0) {
        var unbrokenLine = lines[i].replace("<p>", "").replace("</p>", "").split("<br />");

        var methodHeader = "<h4 class=\"methodHeader\">" + unbrokenLine[0].substring("@method".length) + "</h4>";
        var paramsList = "";

        if (unbrokenLine.length > 1) {

            paramsList = "<div class=\"methodParam\"><h5>Parameters</h5><ul>";
            var params = unbrokenLine[1].split(",");

            for (var j = 0; j < params.length; j++) {
                if (j == 0) {
                    paramsList += "<li>" + params[0].substring("@param ".length); + "</li>";
                }
                else {
                    paramsList += "<li>" + params[j] + "</li>";
                }
            }

            paramsList += "</ul>";
        }
        lines[i] = "<p>" + methodHeader + paramsList + "</p>";
    }
    else if (lines[i].indexOf("@prop") >= 0) {

        var unbrokenLine = lines[i].replace("<p>", "").replace("</p>", "").split("<br />");

        var propertyHeader = "<h4 class=\"propertyHeader\">" + unbrokenLine[0].substring("@prop".length) + "</h4>";

        lines[i] = "<p>" + propertyHeader + "</p>";
    }
    else if (lines[i].indexOf("@obj") >= 0) {
        var unbrokenLine = lines[i].replace("<p>", "").replace("</p>", "").split("<br />");

        var objHeader = "<h4 class=\"objHeader\">" + unbrokenLine[0].substring("@prop".length) + "</h4>";

        lines[i] = "<p>" + objHeader + "</p>";
    }

    return lines.join("\n");
}

docs.copyassets = function (outName) {   
    wrench.copyDirSyncRecursive("build/resources", "out");
    
    fs.mkdir("tmp/", "0777");
    
    wrench.mkdirSyncRecursive("out/" + outName, 0777);
    
    var imagesDir = "src/" + outName + "/images";

    try {
        wrench.copyDirSyncRecursive(imagesDir, "out/" + outName + "/images");
    }
    catch (e) {
        // no images...who cares
    }
}

docs.clean = function (dir) {
   if (path.existsSync(dir)) wrench.rmdirSyncRecursive(dir);
}
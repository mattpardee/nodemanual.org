var docs   = {},
    path   = require('path'),
    fs	   = require('fs');

var fileOrder = new Array(1);

docs = exports;

docs.generate = exports.generate = function (type) {
	var tocFile = fs.readFileSync("src/" + type + "/toc.json"),
		toc;

	try {
    	toc = JSON.parse(tocFile).toc;
	} catch (err) {
	    console.log("There was an error parsing the JSON TOC for " + tocFile + ": " + err);
	}
	
	for (var i = 0; i < toc.length; i++)
	{
		storeTOCInfo(toc[i].name, combineToc(i, "src/" + type, toc[i]), toc[i].metadata);
	}

	var files = fileOrder.filter(function(value){return (value==undefined) ? 0 : 1;});
	fileOrder = [];

	printContents(0, type, files, type);
}

function combineToc(i, prefix, toc)
{
	var files = new Array(1),
		contentFile = prefix + "/" + toc.name + "/" + toc.content;	
	
	storeTOCInfo(toc.name, contentFile, toc.metadata);
	
	if (toc.folder != undefined)
	{
		for (var i = 0; i < toc.folder.length; i++)
		{
			storeTOCInfo(toc.folder[i].name, combineToc(i, prefix + "/" + toc.name, toc.folder[i], fileOrder), toc.folder[i].metadata);
		}
	}
}

function storeTOCInfo(dirName, fileContent, fileMetadata)
{
	if (fileContent != undefined)
	{
		var srcDir = fileContent.substring(0, fileContent.lastIndexOf("/"));
		fileOrder.push({name: dirName, content: fileContent, metadata: srcDir + "/" + fileMetadata});	
	}
}

function printContents(i, type, files, destFile)
{
	
	var destFile  = "tmp/" + type + ".md";

	if (i < files.length) {
		traverse(type, files[i], destFile, function(err) {
			if (err) console.log("Error printing contents: " + err);
			printContents(i + 1, type, files, destFile);
		});
	}
	else {
		docs.assemble(type);
	}
}

function traverse(type, files, destFile, cb) 
{
	var dirName = files.name;
	var contentFile = files.content;
	var metadataFile = files.metadata;

	path.exists(contentFile, function (exists) {
		if (exists)
		{
			var readStream = fs.createReadStream(contentFile);
	  		var writeStream = fs.createWriteStream(destFile, {flags: "a+"});
  
			readStream.addListener("data", function(chunk) {
				var lines = chunk.toString().split('\n');
				var title = lines[0]; // save the first line for additional processing
				lines.splice(0,1);
				var cleanChunk = lines.join('\n');

				var metadata;

				path.exists(metadataFile, function (exists) {
					var idLink = "<a id=\"" + dirName + "\"></a>";
					var byline;

					if (exists) {				
						try {
							metadata = JSON.parse(fs.readFileSync(metadataFile));
						} catch (err) {
							console.log("There was an error parsing the JSON metadata for " + metadataFile + ": " + err);
						}

						byline = "<span class=\"cite\">By " + metadata.author + " (" + metadata.date + ")</span>";
					}
					else
						byline = "";

					title = "\n\n" + idLink + "\n\n" + title + "\n" + byline + "\n\n";

                    writeStream.write(title + cleanChunk);
				});
    		});

    		readStream.addListener("end",function() {
  				 cb(null); // go on to the next file
			});
    	}
    	else {
	    	console.log("Warning: " + contentFile + " does not exist.");
            cb(null);
    	}
	});	
}

docs.assemble = function(outName)
{
	var tmpFile = "tmp/" + outName + ".md";
	var outFile = "out/" + outName + "/index.html";
	var headerFile = "build/" + outName + "_header.html";
	var footerFile = "build/" + outName + "_footer.html";
	var gfm = require("github-flavored-markdown");

	var readHeaderStream = fs.createReadStream(headerFile);
	var writeStream = fs.createWriteStream(outFile, {flags: "a+"});

    readHeaderStream.on('open', function() {
        readHeaderStream.pipe(writeStream, { end: false } );
    });
    
    readHeaderStream.on('end', function() {
       var readTmpStream = fs.createReadStream(tmpFile);

        readTmpStream.on('data', function(data) {
      		writeStream.write(gfm.parse(data.toString()));
      	});
    
      	readTmpStream.on('end', function() {
      		var readFooterStream = fs.createReadStream(footerFile);
      		readFooterStream.pipe(writeStream);
      	});
    });
    

}

docs.copyassets = function(outName)
{
	var wrench = require('wrench');
	wrench.copyDirSyncRecursive("build/resources", "out");
	fs.mkdir("tmp", "0777");
	fs.mkdir("out/" + outName, "0777");
}

docs.clean = function (out) 
{
	var wrench = require('wrench');
	var fs = require('fs');

	if (path.existsSync(out))
		wrench.rmdirSyncRecursive(out);
}
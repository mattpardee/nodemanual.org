var http = require('http');
var fs = require('fs');
var assert = require('assert');

var snippetsServer = "snippets.c9.io";

function checkScript(ghFile)
{
	var options = {
		host: snippetsServer,
		path: ghFile,
		method: 'GET'
	};
											 		
	function checkStatus(response) {
		assert.notEqual(response.statusCode, 404, "Couldn't find " + options.path + "!");
	}

	http.request(options, checkStatus).end();
}

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          var readStream = fs.ReadStream(file);
          readStream.setEncoding('ascii');

          readStream.on('data', function(textData) {
          	 var snippetsLoc = textData.indexOf("<script src='http://snippets.c9.io");
			 if (snippetsLoc >= 0)
			 {
			 	var snippetsHTMLArray = textData.match(/<script src=['"]+[http://]*snippets.c9.io(.+)\?/ig);
			 	
			 	// skip empty entries
			 	if (snippetsHTMLArray !== null)
			 	{
				 	snippetsHTMLArray.forEach(function (element, index, array) {
				 		var ghFile = element.split(snippetsServer)[1];
				 		ghFile = ghFile.substr(0, ghFile.length-1); // remove ?

				 		checkScript(ghFile);
				 	});
				}
			 }
		  });
        }
      });
    });
  });
};

walk("../src/");
var http = require('http');
var fs = require('fs');
var assert = require('assert');

//The url we want, plus the path and options we need
var options = {
  host: 'snippets.c9.io',
  path: '',
  method: 'GET'
};

var processScript = function(response) {

  
  if (response.statusCode == 404)
    console.log("WTF");
  // keep track of the data you receive
  response.on('data', function(tweets) {
    tweetData += tweets + "\n";
  });

  // finished? ok, write the data to a file
  response.on('end', function() {
    console.log(tweetData);
  });
}

http.request(options, processScript).end();
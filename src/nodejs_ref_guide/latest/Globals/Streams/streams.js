/**
 * class streams
 *
 * A stream is an abstract interface implemented by various objects in Node.js. For example, a request to an HTTP server is a stream, as is stdout. Streams can be readable, writable, or both. All streams are instances of [[EventEmitter `EventEmitter`]].
 *
 * For more information, see [this article on understanding streams](../../nodejs_dev_guide/streams.html).
 *
 * #### Example: Printing to the console
 * 		var http = require('http');
 * 		var stdout = process.stdout; // This is a writeable stream to the console
 * 
 * 		// navigate to http://127.0.0.1:8000/, and watch the console' print messages
 * 		http.createServer(function (request, response) {
 *    		 stdout.write("Hello");
 *    		 stdout.write("\nWorld!");
 * 		}).listen(8000);
 *
 * #### Example: Reading from the console
 *
 * 		var http = require('http');
 * 		var stdout = process.stdout; // a writeable stream
 * 		var stdin = process.stdin; // a readable stream
 * 
 * 		// navigate to the web server in your browser, and then switch to the console
 * 		// to interact with the text
 * 		http.createServer(function (request, response) {
 * 		    stdout.write("Tell me something--anything!--and I'll flip it around on you." +
 * 		                 "\nHit Enter when you're done: ");
 *
 * 			// process.stdin is paused by default, so we need to "start" it
 * 		    stdin.resume();
 *
 *			// we don't want multiple input, so we'll use listen for 'once'
 *			// instead of 'on'
 * 		    stdin.once('data', function (userInput) {
 * 		        var strUserInput = userInput.toString();
 * 		        stdout.write(strUserInput.split("").reverse().join("")); 
 * 		    });
 * 
 * 		}).listen(8000);
 **/

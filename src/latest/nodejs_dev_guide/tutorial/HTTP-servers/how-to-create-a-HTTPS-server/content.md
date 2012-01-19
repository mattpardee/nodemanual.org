### Creating an HTTPS Server

To create an HTTPS server, you need two things: an SSL certificate, and Node's built-in `https` module.

We need to start out with a word about SSL certificates.  Speaking generally, there are two kinds of certificates: those signed by a 'Certificate Authority', or CA, and a 'self-signed certificates'.  A Certificate Authority is a trusted source for an SSL certificate, and using a certificate from a CA allows your users to be trust the identity of your website. In most cases, you would want to use a CA-signed certificate in a production environment; for testing purposes, however, a self-signed certicate will do just fine.

To generate a self-signed certificate, run the following in your shell:

	openssl genrsa -out key.pem
	openssl req -new -key key.pem -out csr.pem
	openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
	rm csr.pem

This should leave you with two files, `cert.pem` (the certificate) and `key.pem` (the private key). This is all you need for a SSL connection. 

Next, set up a quick "hello world" example. ():

    var https = require('https');
    var fs = require('fs');

    // read the certificate
    var options = {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    };

    var a = https.createServer(options, function (req, res) {
      res.writeHead(200);
      res.end("hello world\n");
    }).listen(8000);

The biggest difference between [HTTP](HTTP-servers.html) and HTTPS is the additional `options` parameter

<Note>`fs.readFileSync()`&mdash;unlike `fs.readFile()`&mdash;blocks the entire process until it completes.  In situations like this&mdash;loading vital configuration data&mdash;the `Sync` functions are okay.  In a busy server, however, using a synchronous function during a request will force the server to deal with the requests one by one!</Note>

Now that your server is set up and started, you should be able to get the file with curl:

    curl -k https://localhost:8000

or in your browser, by going to `https://localhost:8000`. 
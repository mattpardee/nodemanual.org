

&ltdiv class="hero-unit">

<a class="hiddenLink" id="cryptography"></a>

## Cryptography


&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="hashes"></a>

### Hashes
<span class="cite">by Joshua Holbrook (Last Updated: Aug 26 2011)</span>


#### Understanding a Hash

A hash is a fixed-length string of bits that is procedurally and deterministially generated from some arbitrary block of source data. Some important properties of these hashes (the type useful for cryptography) include:

* A fixed length: This means that, no matter what the input, the length of the hash is the same. For example, md5 hashes are always 128 bits long whether the input data is a few bits or a few gigabytes.

* Deterministic: For the same input, you should expect to be able to calculate exactly the same hash. This makes hashes useful for checksums.

* Collision-Resistant: A collision is when the same hash is generated for two different input blocks of data. Hash algorithms are designed to be extremely unlikely to have collisions&mdash;exactly how unlikely is a property of the hash algorithm. The importance of this property depends on the use case.

* Unidirectional: A good hash algorithm is easy to apply, but hard to undo. This means that, given a hash, there isn't any reasonable way to find out what the original piece of data was.

#### Hash Algorithms That Work With Crypto

The hashes that work with crypto are dependent on what your version of OpenSSL supports. If you have a new enough version of OpenSSL, you can get a list of hash types your OpenSSL supports by typing `openssl list-message-digest-algorithms` into the command line. For older versions, type `openssl list-message-digest-commands` instead. Some of the most common hash types are [sha1](http://en.wikipedia.org/wiki/Sha1) and [md5](http://en.wikipedia.org/wiki/Md5).

#### How To Calculate Hashes with Crypto

The `Crypto` module has a method called `createHash` which allows you to calculate a hash. Its only argument is a string representing the hash.

This example finds the md5 hash for the string, "Man oh man do I love node!":

    require("crypto")
      .createHash("md5")
      .update("Man oh man do I love node!")
      .digest("hex");

The `update()` method is used to push data to later be turned into a hash with the `digest()` method. `update()` can be invoked multiple times to ingest streaming data, such as buffers from a file read stream. The argument for `digest` represents the output format, and may either be "binary", "hex", or "base64". It defaults to binary.

#### HMAC

HMAC stands for Hash-based Message Authentication Code, and is a process for applying a hash algorithm to both data and a secret key that results in a single final hash. Its use is similar to that of a vanilla hash, but also allows to check the _authenticity_ of data as well as the integrity of data (as you can using md5 checksums).

The API for hmacs is very similar to that of `createHash()`, except that the method is called `createHmac()` and it takes a key as a second argument:

    require("crypto").createHmac("md5", "password")
      .update("If you love node so much why don't you marry it?")
      .digest("hex");

The resulting md5 hash is unique to both the input data and the key.

#### Ciphers

Ciphers allow you to encode and decode messages given a password.

Like crypto's hash algorithms, the cyphers that work with `Crypto` are dependent on what your version of OpenSSL supports. You can get a list of hash types your OpenSSL supports by typing `openssl list-cipher-commands` into the command line for older versions, or `openssl list-cipher-algorithms` for newer versions of OpenSSL. OpenSSL supports many ciphers. A good and popular one is [AES192](http://en.wikipedia.org/wiki/Aes192).

#### How To Use Cipher Algorithms with Crypto:

`Crypto` comes with two methods for ciphering and deciphering:

* `crypto.createCypher(algorithm, key)`
* `crypto.createDecipher(algorithm, key)`

Both of these methods take arguments similarly to `createHmac`. They also both have analogous `update()` functions. However, each use of `update()` returns a chunk of the encoded/decoded data instead of requiring one to call `digest()` to get the result. Moreover, after encoding (or decoding) your data, you will likely have to call the `final()` method to get the last chunk of encoded information.

Here's an example, slightly less trivial than previous examples, that uses crypto and [optimist](https://github.com/substack/node-optimist) to encode and decode messages from the command line:

    #!/usr/bin/env node

    var crypto = require("crypto"),
        argv = require("optimist").argv;

    if (argv.e && argv.password) {
        var cipher = crypto.createCipher("aes192", argv.password),
            msg = [];

        argv._.forEach( function (phrase) {
            msg.push(cipher.update(phrase, "binary", "hex"));
        });

        msg.push(cipher.final("hex"));
        console.log(msg.join(""));

    } else if (argv.d && argv.password) {
        var decipher = crypto.createDecipher("aes192", argv.password),
            msg = [];

        argv._.forEach( function (phrase) {
            msg.push(decipher.update(phrase, "hex", "binary"));
        });

        msg.push(decipher.final("binary"));
        console.log(msg.join(""));   
    }

Using this script to encode a message looks like this:

    $ ./secretmsg.js -e --password="popcorn" "My treasure is buried behind Carl's Jr. on Telegraph."
    6df66752b24f0886f8a6c55e56977788c2090bb657ff3bd645097f8abe110999

Now, if I gave somebody the same script, my encoded message and the password, they can decode the message and find out where I buried my treasure:

    $ ./secretmsg.js -d --password="popcorn" 6df66752b24f0886f8a6c55e56977788c2090bb657ff3bd645097f8abe110999
    My treasure is buried behind Carl's Jr. on Telegraph.

You should know that what I buried behind Carl's Jr was just a cigarette butt, and that this script is obviously not for serious use.

#### Signing and Verification

`Crypto` has other methods used for dealing with certificates and credentials, as used for TLS:

* `Crypto.createCredentials`
* `Crypto.createSign`
* `Crypto.createVerify`

These methods supply the last building blocks for a complete cryptographic protocol, and require an advanced knowledge of real-world cryptographic protocols to be useful. Again, it is recommended that developers use either the [tls](http://nodejs.org/docs/latest/api/tls.html) module or the [https](http://nodejs.org/docs/latest/api/https.html) module if applicable.&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="using-tls"></a>

### Using TLS
<span class="cite">by Joshua Holbrook (Last Updated: Aug 26 2011)</span>


[Transport Layer Security](http://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS) is the successor to Secure Sockets Layer (SSL). It, along with SSL, are the de-facto standard cryptographic protocols for secure communications over the web. TSL encrypts communications on top of a network transport layer (typically TCP), and uses public-key cryptography to encrypt messages.

#### Public-Key Cryptography

In public-key cryptography, each peer has two keys: a public key, and a private key. The public key is shared with everyone, and the private key is kept secret. In order to encrypt a message, a computer requires its private key and the recipient's public key. Then, in order to decrypt the message, the recipient requires its _own_ private key and the _sender_'s public key.

In TLS connections, the public key is called a _[certificate](http://en.wikipedia.org/wiki/Digital_certificate)_. This is because it's "[signed](http://en.wikipedia.org/wiki/Digital_signature)" to prove that the public key belongs to its owner. TLS certificates may either be signed by a third-party certificate authority (CA), or they may be [self-signed](http://en.wikipedia.org/wiki/Self-signed_certificate). In the case of Certificate Authorities, Mozilla keeps [a list of trusted root CAs](http://mxr.mozilla.org/mozilla/source/security/nss/lib/ckfw/builtins/certdata.txt) that are generally agreed upon by most web browsers. These root CAs may then issue certificates to other signing authorities, which in turn sign certificates for the general public.

TLS support in Node.js is relatively new. The first stable version of Node.js to support TSL and HTTPS was the v0.4 branch, which was released in early 2011. As such, the TSL APIs in Node.js are still a little rough around the edges.

#### Creating a TLS Server

In most ways, the TLS module's server API is similar to that of the net module. Besides the fact that it's for encrypted connections, the major difference is that the options object passed to `tls.connect()` or `tls.createServer()` needs to include information on both the private key and the certificate, in [pem format](http://en.wikipedia.org/wiki/X.509#Certificate_filename_extensions). Here's an example of a TLS server:

    var tls = require('tls'),
        fs = require('fs'),
        colors = require('colors'),
        msg = [
                ".-..-..-.  .-.   .-. .--. .---. .-.   .---. .-.",
                ": :; :: :  : :.-.: :: ,. :: .; :: :   : .  :: :",
                ":    :: :  : :: :: :: :: ::   .': :   : :: :: :",
                ": :: :: :  : `' `' ;: :; :: :.`.: :__ : :; ::_;",
                ":_;:_;:_;   `.,`.,' `.__.':_;:_;:___.':___.':_;" 
              ].join("\n").cyan;

    var options = {
      key: fs.readFileSync('private-key.pem'),
      cert: fs.readFileSync('public-cert.pem')
    };

    tls.createServer(options, function (s) {
      s.write(msg+"\n");
      s.pipe(s);
    }).listen(8000);


In this example, a "hello world" TLS server is created, listening on port 8000. The options object includes two properties: `key` and `cert`. The contents of these properties come directly from the private key and public certificate stored on the filesystem. In this case they are binary buffers, but the TLS module can also accept unicode strings.

#### Generating Your Private Key And Certificate With OpenSSL:

In order for this example server to work, of course, you will need a private key and a certificate. You can generate both of these with OpenSSL.

First, generate a private key:

    $ openssl genrsa -out private-key.pem 1024
    Generating RSA private key, 1024 bit long modulus
    ......................................++++++
    ........++++++
    e is 65537 (0x10001)

This creates a suitable private key and writes it to `./private-key.pem`.

Next, create a Certificate Signing Request file using your private key:

    $ openssl req -new -key private-key.pem -out csr.pem
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:California
    Locality Name (eg, city) []:Oakland
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:Panco, Inc.
    Organizational Unit Name (eg, section) []:
    Common Name (eg, YOUR name) []:Joshua Holbrook
    Email Address []:blah@boo.com

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:dangerface
    An optional company name []:

The purpose of this CSR is to "request" a certificate. That is, if you wanted a CA to sign your certificate, you could give this file to them to process and they would give you back a certificate.

Alternately, however, you may self-sign your certificate, again using your private key:

    $ openssl x509 -req -in csr.pem -signkey private-key.pem -out public-cert.pem
    Signature ok
    subject=/C=US/ST=California/L=Oakland/O=Panco, Inc./CN=Joshua Holbrook/emailAddress=blah@boo.com
    Getting Private key

This generates your certificate. Now you're cooking!

One way to test out your new "hello world" server is to again use OpenSSL:

    $ openssl s_client -connect 127.0.0.1:8000

You should see a bunch of output regarding the handshaking process, and then at the very end you should see a big, cyan figlet banner saying, "Hi world!"

#### Connecting to a TLS Server

The `tls` module also supplies tools for connecting to such a server:

    var tls = require('tls'),
        fs = require('fs');

    var options = {
      key: fs.readFileSync('private-key.pem'),
      cert: fs.readFileSync('public-cert.pem')
    };

    var conn = tls.connect(8000, options, function() {
      if (conn.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
      } else {
        console.log("Connection not authorized: " + conn.authorizationError)
      }
        console.log();
    });

    conn.on("data", function (data) {
      console.log(data.toString());
      conn.end();
    });

The idea is similar, except instead of creating a server, this script connects to one instead. `tls.connect()` also takes an `options` object, and then returns a stream.

`tls.connect()` also fires a callback when the connection is made, which allows for checking to see if the connection is authorized&mdash;that is, if all the certificates are in order. `conn.authorized` is a boolean, and `conn.authorizationError` is a string containing the reason that the connection is unauthorized.

This is what happens when the client is run (with the server running):

    $ node client.js
    Connection not authorized: DEPTH_ZERO_SELF_SIGNED_CERT

    .-..-..-.  .-.   .-. .--. .---. .-.   .---. .-.
    : :; :: :  : :.-.: :: ,. :: .; :: :   : .  :: :
    :    :: :  : :: :: :: :: ::   .': :   : :: :: :
    : :: :: :  : `' `' ;: :; :: :.`.: :__ : :; ::_;
    :_;:_;:_;   `.,`.,' `.__.':_;:_;:___.':___.':_;

Note that self-signing the server certificate results in a non-authorized status because you're not listed as a trusted certificate authority.

It's entirely possible to "upgrade" an existing tcp connection into a TLS-encrypted one with Node.js. However, Node.js does not have a special functions for doing so as of the v0.6 branch. Therefore, it needs to be done "by-hand", using the crypto module and some undocumented `tls` module functionality. Node's documentation points to [https://gist.github.com/848444](https://gist.github.com/848444), which aims to abstract the process.&lt/div>

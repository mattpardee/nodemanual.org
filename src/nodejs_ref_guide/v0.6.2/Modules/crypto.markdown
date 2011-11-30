## Cryptography and OpenSSL

The `crypto` module offers a way of encapsulating secure credentials to be used as part of a secure HTTPS net or http connection. To access this module, add `require('crypto')` in your code. 

The module also offers a set of wrappers for OpenSSL's methods, which actually contains these objects:

* Diffie-Hellman
* Hash
* HMAC
* Cipher
* Decipher
* Signer
* Verifier

This documentation is organized to describe those objects within their own sections.

**Note**: all `algorithm` implementations below are dependent on the OpenSSL version installed on the platform. Some examples are `'sha1'`, `'md5'`, `'sha256'`, and `'sha512'`.

### Crypto Methods

@method `crypto.createCipher(algorithm, password)`
@param `algorithm`: The algorithm to use, `password`: The password to use

Creates and returns a cipher object with the given algorithm and password.

The `password` is used to derive both the key and IV, which must be a binary-encoded string. For more information, see the section on [Buffers](buffers.html).

@method `crypto.createCipheriv(algorithm, key, iv)`
@param `algorithm`: The algorithm to use, `key`: A raw key used in the algorithm, `iv`: The Initialization Vector

Creates and returns a cipher object, with the given algorithm, key, and IV.

Both `key` and `iv` must be a binary-encoded string. For more information, see the section on [Buffers](buffers.html).

@method `crypto.createCredentials([details])`
@param `details`: A dictionary of fields to populate the credential with

Creates a credentials object, with  `details` being a dictionary with the following keys:

* `key`: a string holding the PEM encoded private key
* `cert`: a string holding the PEM encoded certificate
* `ca`: either a string or list of strings of PEM encoded CA certificates to trust.

If no `ca` details are given, then Node.js uses the default publicly trusted list of CAs as given by [Mozilla](http://mxr.mozilla.org/mozilla/source/security/nss/lib/ckfw/builtins/certdata.txt).

@method `crypto.createDecipher(algorithm, password)`
@param `algorithm`: The algorithm to use, `password`: The password to use

Creates and returns a decipher object, with the given algorithm and key.

@method `crypto.createDecipheriv(algorithm, key, iv)`
@param `algorithm`: The algorithm to use, `key`: A raw key used in the algorithm, `iv`: The Initialization Vector

Creates and returns a decipher object, with the given algorithm, key, and iv.

@method `crypto.createDiffieHellman(prime_length)`
@param `prime_length`: The bit length to calculate with

Creates a Diffie-Hellman key exchange object and generates a prime of the given bit length. The generator used is `2`.

@method `crypto.createDiffieHellman(prime, encoding='binary')`
@param `prime`: The prime to calculate with, `encoding`: The encoding to use; defaults to `'binary'`

Creates a Diffie-Hellman key exchange object using the supplied prime. The
generator used is `2`. 

The `encoding` can be `'binary'`, `'hex'`, or `'base64'`.

@method `decipher.update(data, input_encoding='binary', output_encoding='binary')`
@param `data`: The data to use for an update, `input_encoding`: Defines how the input is encoded; defaults to binary, `output_encoding`: Defines how the output is encoded; defaults to `'binary'`

Updates the decipher with `data`.

The `input_encoding` can be `'binary'`, `'base64'` or `'hex'`. 
The `output_encoding` can be `'binary'`, `'ascii'` or `'utf8'`.

@method `crypto.createHash(algorithm)`
@param `algorithm`: The hash algorithm to use

Creates and returns a cryptographic hash object with the given algorithm. The object can be used to generate hash digests.

On recent Node.js releases, `openssl list-message-digest-algorithms` displays the available digest algorithms.

@method `crypto.createSign(algorithm)`
@param `algorithm`: The algorithm to use

Creates and returns a signing object, with the given algorithm.

#### Example

This program takes the sha1 sum of a file

    var filename = process.argv[2];
    var crypto = require('crypto');
    var fs = require('fs');

    var shasum = crypto.createHash('sha1');

    var s = fs.ReadStream(filename);
    s.on('data', function(d) {
      shasum.update(d);
    });

    s.on('end', function() {
      var d = shasum.digest('hex');
      console.log(d + '  ' + filename);
    });

@method `crypto.createHmac(algorithm, key)`
@param `algorithm`: The algorithm to use; `key`: The HMAC key to be used

Creates and returns a cryptographic HMAC object with the given algorithm and key. For more information on HMAC, see [this article](http://en.wikipedia.org/wiki/HMAC).

@method `crypto.pbkdf2(password, salt, iterations, keylen, callback(err, derivedKey))`
@param `password`: The password to use, `salt`: The salt to use, `iterations`: The number of iterations to use, `keylen`: The final key length, `callback()`: The callback to execute when finished; `err` is the error object, and `derivedKey` is the resulting key

An asynchronous PBKDF2 applies pseudorandom function HMAC-SHA1 to derive a key of the given length from the given password, salt, and number of iterations.


@method `crypto.randomBytes(size, [callback(ex, buf)])`
@param `size`: The size of the cryptographic data, `[callback()]`: The callback to execute when finished; `ex` is the error object, and `buf` is the resulting crypto data

Generates cryptographically strong pseudo-random data.

#### Example

    // async
    crypto.randomBytes(256, function(ex, buf) {
      if (ex) throw ex;
      console.log('Have %d bytes of random data: %s', buf.length, buf);
    });

    // sync
    try {
      var buf = crypto.randomBytes(256);
      console.log('Have %d bytes of random data: %s', buf.length, buf);
    } catch (ex) {
      // handle error
    }
    
    
### Cipher Methods

@method `cipher.final(output_encoding='binary')`
@param `output_encoding`: The encoding to use for the output; defaults to binary

Returns any remaining enciphered contents. `output_encoding` can be `'binary'`, `'base64'`, or `'hex'`.

**Note**: the `cipher` object can't be used after the `final()` method has been called.

@method `cipher.update(data, input_encoding='binary', output_encoding='binary')`
@param `data`: The data to use for an update, `input_encoding`: Defines how the input is encoded; defaults to binary, `output_encoding`: Defines how the output is encoded; defaults to `'binary'`

Updates the cipher with `data`. This returns the enciphered contents, and can be called many times with new data as it is streamed.

The `input_encoding` can be `'utf8'`, `'ascii'` or `'binary'`. 

The `output_encoding` can be `'binary'`, `'base64'` or `'hex'`.

### Decipher Methods

@method `decipher.final(output_encoding='binary')`
@param `output_encoding`: The encoding to use for the output; defaults to binary

Returns any remaining plaintext which is deciphered, with `output_encoding` being one of `'binary'`, `'ascii'`, or `'utf8'`.

**Note**: the `decipher` object can't be used after `final()` method been called.

### Diffie-Hellman Methods

@method `diffieHellman.computeSecret(other_public_key, input_encoding='binary', output_encoding=input_encoding)`
@param `other_public_key`: The other party's public key, `input_encoding`: The encoding used to interprate the public key; defaults to `'binary'`, `output_encoding`: The encoding of the returned computation; defaults to the `input_encoding`

Computes the shared secret and returns the computed shared secret. 

The encodings can be `'binary'`, `'hex'`, or `'base64'`. 

@method `diffieHellman.getGenerator(encoding='binary')`
@param `encoding`: The encoding to use; defaults to `'binary'`

Returns the Diffie-Hellman prime in the specified encoding, which can be
`'binary'`, `'hex'`, or `'base64'`.

@method `diffieHellman.getPrime(encoding='binary')`
@param `encoding`: The encoding to use; defaults to `'binary'`

Returns the Diffie-Hellman prime in the specified encoding, which can be
`'binary'`, `'hex'`, or `'base64'`.

@method `diffieHellman.getPrivateKey(encoding='binary')`
@param `encoding`: The encoding to use; defaults to `'binary'`

Returns the Diffie-Hellman private key in the specified encoding, which can
be `'binary'`, `'hex'`, or `'base64'`.

@method `diffieHellman.getPublicKey(encoding='binary')`
@param `encoding`: The encoding to use; defaults to `'binary'`

Returns the Diffie-Hellman public key in the specified encoding, which can
be `'binary'`, `'hex'`, or `'base64'`.

@method `diffieHellman.generateKeys(encoding='binary')`
@param `encoding`: The encoding to use; defaults to `'binary'`

Generates private and public Diffie-Hellman key values, and returns the
public key in the specified encoding. This key should be transferred to the
other party. Encoding can be `'binary'`, `'hex'`, or `'base64'`.

@method `diffieHellman.setPrivateKey(public_key, encoding='binary')`
@param `public_key`: The public key that's shared, `encoding`: The encoding to use; defaults to `'binary'`

Sets the Diffie-Hellman private key. The key encoding can be `'binary'`, `'hex'`, or `'base64'`.

@method `diffieHellman.setPublicKey(public_key, encoding='binary')`
@param `public_key`: The public key that's shared, `encoding`: The encoding to use; defaults to `'binary'`

Sets the Diffie-Hellman public key. The key encoding can be `'binary'`, `'hex'`,
or `'base64'`.

### Hash Methods

@method `hash.digest(encoding='binary')`
@param `encoding`: The encoding to use; defaults to binary

Calculates the digest of all of the passed data to be hashed. The `encoding` can be `'hex'`, `'binary'`, or `'base64'`.

**Note**: the `hash` object can not be used after the `digest()` method been called.

@method `hash.update(data)`
@param `data`: The data to use for an update

Updates the hash content with the given `data`. This can be called many times with new data as it is streamed.

### HMAC Methods

@method `hmac.digest(encoding='binary')`
@param `encoding`: The encoding to use; defaults to binary

Calculates the digest of all of the passed data to the HMC. The `encoding` can be `'hex'`, `'binary'` or `'base64'`.

**Note**: the `hmac` object can not be used after the `digest()` method been called.

@method `hmac.update(data)`
@param `data`: The data to use for an update

Update the HMAC content with the given `data`. This can be called many times with new data as it is streamed.

### Signer Methods

@method `signer.sign(private_key, output_format='binary')`
@param `private_key`: A string containing the PEM encoded private key for signing, `output_format`: The output encoding format

Calculates the signature on all the updated data passed through the signer.
`
Returns the signature in a format defined by `output_format`, which can be `'binary'`, `'hex'` or `'base64'`.

**Note**: the `signer` object can not be used after the `sign()` method has been called.

@method `signer.update(data)`
@param `data`: The data to use for an update

Updates the signer object with data. This can be called many times with new data as it is streamed.

### Verifier Methods

@method `verifier.verify(object, signature, signature_format='binary')`
@param `object`: A string containing a PEM encoded object, which can be one of RSA public key, DSA public key, or X.509 certificate, `signature`: The previously calculated signature for the data, `signature_format`, The format of the signature; defaults to `'binary'`

Returns `true` or `false` depending on the validity of the signature for the data and public key.

The `signature_format` can be `'binary'`, `'hex'`, or `'base64'`.

**Note**: the `verifier` object can't be used after the `verify()` method has been called.

@method `verifier.update(data)`
@param `data`: The data to use for an update

Updates the verifier object with data. This can be called many times with new data as it is streamed.
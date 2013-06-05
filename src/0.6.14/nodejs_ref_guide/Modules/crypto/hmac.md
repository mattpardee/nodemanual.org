/** section: Crypto
class hmac

A class for creating cryptographic hmac content. It's a representation of the [OpenSSL implementation of hmac](http://www.openssl.org/docs/crypto/hmac.html#) algorithms. It can be created as a returned value from [[crypto.createHmac `crypto.createHmac()`]].

#### Example

<script src='http://snippets.nodemanual.org/github.com/mattpardee/nodemanual.org-examples/nodejs_ref_guide/crypto/crypto.createHmac.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

**/


/**
hmac.digest([encoding='binary']) -> String
- encoding (String): The encoding to use; can be `'hex'`, `'binary'` or `'base64'`

Calculates the digest of all of the passed data to the hmac.

<Note>The `hmac` object can't be used after the `digest()` method been called.</Note>

**/ 


/** chainable
hmac.update(data) -> hmac
- data (String): The data to use for an update

Update the HMAC content with the given `data`. This can be called many times with new data as it is streamed.


**/ 
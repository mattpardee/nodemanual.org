/** section: Crypto
  * class hmac
  *
  * This class is a representation of the [OpenSSL implementation of hmac](http://www.openssl.org/docs/crypto/hmac.html#) algorithms. It can be created as a returned value from [[crypto.createHmac `crypto.createHmac()`]].
  *
  * For more information, you may want to read [this chapter on using the `crypto` module](../nodejs_dev_guide/cryptography.html).
  *
 * #### Example
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=crypto.createHmac.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 *
 **/


/**
 * hmac.digest([encoding='binary']) -> String
 * - encoding (String): The encoding to use; can be `'hex'`, `'binary'` or `'base64'`
 * 
 * Calculates the digest of all of the passed data to the hmac.
 *
 * <Note>The `hmac` object can't be used after the `digest()` method been called.</Note>
 * 
**/ 


/** chainable
 * hmac.update(data) -> hmac
 * - data (String): The data to use for an update
 *
 * Update the HMAC content with the given `data`. This can be called many times with new data as it is streamed.
 *
 * 
**/ 
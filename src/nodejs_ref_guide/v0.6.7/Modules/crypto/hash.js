
/** section: Crypto
  * class hash
  *
  * This class is a representation of the [OpenSSL implementation of hash](http://www.openssl.org/docs/crypto/crypto.html#item_AUTHENTICATION) algorithms. It can be created as a returned value from [[crypto.createHash `crypto.createHash()`]].
  *
  * For more information, you may want to read [this chapter on using the `crypto` module](../nodejs_dev_guide/cryptography.html).
  *
 * #### Example
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=crypto.createHash.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 *
 **/

/** 
 * hash.digest([encoding='binary']) -> Void
  * - encoding (String): The encoding to use; can be `'binary'`, `'hex'`, or `'base64'`
 *
 * Calculates the digest of all of the passed data to be hashed.
 * 
 * <Note>The `hash` object can't be used after the `digest()` method been called.</Note>
 *
 * 
**/ 


/** chainable
 * hash.update(data, [input_encoding]) -> String
 * - data (String): The data to use for an update
 * - input_encoding (String): The encoding to use; can be `'binary'`, `'hex'`, or `'base64'`
 *
 * Updates the hash content with the given `data`. This can be called many times with new data as it is streamed.
 *
 * 
**/ 

/** section: Crypto
  * class hash
  *
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
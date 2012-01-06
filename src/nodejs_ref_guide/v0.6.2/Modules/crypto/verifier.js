/** section: Crypto
  * class verifier
  *
  *
 **/

/**
 * verifier.verify(object, signature, signature_format='binary') -> Boolean
 * - object (String) : A string containing a PEM encoded object, which can be one of the following: an RSA public key, a DSA public key or an X.509 certificate
 * - signature (String): The previously calculated signature for the data
 * - signature_format (String): The format of the signature; can be `'binary'`, `'hex'`, or `'base64'`
 *
 * Returns `true` or `false` depending on the validity of the signature for the data and public key.
 * 
 * <Note>The `verifier` object can't be used after the `verify()` method has been called.</Note>
 *
 * 
**/ 


/** chainable
 * verifier.update(data) -> verifier
 * - data (String): The data to use for an update
 *
 * Updates the verifier object with data. This can be called many times with new data as it is streamed. 
 * 
**/ 
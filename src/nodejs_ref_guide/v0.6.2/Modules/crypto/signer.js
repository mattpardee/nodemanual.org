/** section: Crypto
  * class signer
  *
  *
 **/

/**
 * signer.sign(private_key, output_format='binary') -> String
 * - private_key (String) : A string containing the PEM encoded private key for signing
 * - output_format (String): The output encoding format; can be `'binary'`, `'hex'` or `'base64'`
 *
 * Calculates the signature on all the updated data passed through the signer.
 *
 * <Note>The `signer` object can not be used after the `sign()` method has been called.</Note>
 *
 * #### Returns
 *
 *  The signature in a format defined by `output_format`, which .
**/ 


/** chainable
 * signer.update(data) -> signer
 * - data (String) : The data to use for an update
 * 
 * Updates the signer object with data. This can be called many times with new data as it is streamed.
 *
**/ 
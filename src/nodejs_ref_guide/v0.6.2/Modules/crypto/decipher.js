/** section: Crypto
  * class decipher
  *
  *
 **/

/** chainable
 * decipher.update(data, input_encoding='binary', output_encoding='binary') -> decipher
 * - data (String): The data to use for an update
 * - input_encoding (String): Defines how the input is encoded
 * - output_encoding (String): Defines how the output is encoded
 * 
 * Updates the decipher with `data`.
 * 
 * The `input_encoding` can be `'binary'`, `'base64'` or `'hex'`. 
 * The `output_encoding` can be `'binary'`, `'ascii'` or `'utf8'`.

 * 
**/ 


/**
 * decipher.final(output_encoding='binary') -> String
 * - output_encoding (String): The encoding to use for the output; can be either `'binary'`, `'ascii'`, or `'utf8'`
 * 
 * Returns any remaining plaintext which is deciphered.
 * 
 * <Note>The `decipher` object can't be used after the `final()` method been called.</Note>
 *
 * 
**/ 
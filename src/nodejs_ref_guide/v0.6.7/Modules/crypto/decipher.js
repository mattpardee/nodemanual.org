/** section: Crypto
  * class decipher
  *
  * This class is used to decipher previously created [[cipher `cipher`]] objects. It can be created as a returned value from [[crypto.createDecipher `crypto.createDeipher()`]] or [[crypto.createDecipheriv `crypto.createDecipheriv()`]].
  *
  * For more information, you may want to read [this chapter on using the `crypto` module](../nodejs_dev_guide/cryptography.html).
  *
 * #### Example
 * 
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=cipher.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 *
 **/

/** chainable
 * decipher.update(data, [input_encoding='binary'], [output_encoding='binary']) -> decipher
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
 * decipher.final([output_encoding='binary']) -> String
 * - output_encoding (String): The encoding to use for the output; can be either `'binary'`, `'ascii'`, or `'utf8'`
 * 
 * Returns any remaining plaintext which is deciphered.
 * 
 * <Note>The `decipher` object can't be used after the `final()` method been called.</Note>
 *
 * 
**/ 
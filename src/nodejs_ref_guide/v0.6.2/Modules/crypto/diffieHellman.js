/** section: Crypto
  * class diffieHellman
  *
  *
 **/

/**
 * diffieHellman.computeSecret(other_public_key, input_encoding='binary', output_encoding=input_encoding) -> String
 * - other_public_key (String): The other party's public key
 * - input_encoding (String): The encoding used to interprate the public key; can be `'binary'`, `'base64'`, or `'hex'`. 
 * - output_encoding (String): The encoding of the returned computation; defaults to the `input_encoding`
 * 
 * Computes the shared secret and returns the computed shared secret. 
 * 
 * 
**/ 


/**
 * diffieHellman.getGenerator(encoding='binary') -> String
 * - encoding (String) : The encoding to use; can be `'binary'`, `'hex'`, or `'base64'`
 * 
 * Returns the Diffie-Hellman prime in the specified encoding.
 *
 * #### Example
 *
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=diffieHellman.getGenerator.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 *
**/ 


/**
 * diffieHellman.getPrime(encoding='binary') -> String
 * - encoding (String): The encoding to use;  can be `'binary'`, `'hex'`, or `'base64'`
 * 
 * Returns the Diffie-Hellman prime in the specified encoding.
 *
 * #### Example
 *
 * <script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=diffieHellman.getPrime.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>
 *
**/ 


/**
 * diffieHellman.getPrivateKey(encoding='binary') -> String
 * - encoding (String): The encoding to use;  can be `'binary'`, `'hex'`, or `'base64'`
 *
 * Returns the Diffie-Hellman private key in the specified encoding.
 * 
**/ 


/**
 * diffieHellman.getPublicKey(encoding='binary') -> String
 * - encoding (String): The encoding to use;  can be `'binary'`, `'hex'`, or `'base64'`
 *
 * Returns the Diffie-Hellman public key in the specified encoding.
 * 
**/ 


/**
 * diffieHellman.generateKeys(encoding='binary') -> String
 * - encoding (String): The encoding to use;  can be `'binary'`, `'hex'`, or `'base64'`
 *
 * Generates private and public Diffie-Hellman key values, and returns the public key in the specified encoding. This key should be transferred to the other party.
 * 
**/ 


/**
 * diffieHellman.setPrivateKey(public_key, encoding='binary') -> Void
 * - public_key (String): The public key that's shared
 * - encoding (String): The encoding to use;  can be `'binary'`, `'hex'`, or `'base64'`
 *
 * Sets the Diffie-Hellman private key. 
 * 
**/ 


/**
 * diffieHellman.setPublicKey(public_key, encoding='binary') -> Void
 * - public_key (String): The public key that's shared
 * - encoding (String): The encoding to use;  can be `'binary'`, `'hex'`, or `'base64'`
 *
 * Sets the Diffie-Hellman public key.
 * 
**/ 

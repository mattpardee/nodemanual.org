## Cryptography

The `crypto` module is a wrapper for OpenSSL cryptographic functions. It supports calculating hashes, authentication with HMAC, ciphers, and more!

The `crypto` module is mostly useful as a tool for implementing cryptographic protocols such as TLS and https. For most users, Node's built-in `tls` and `https` modules should more than suffice. However, for the user that only wants to use small parts of what's needed for full-scale cryptography or is crazy/desperate enough to implement a protocol using OpenSSL and Node.js, this section is for you.
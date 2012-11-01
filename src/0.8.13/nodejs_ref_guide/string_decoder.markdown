## StringDecoder

> Stability: 3 - Stable

StringDecoder decodes a [[Buffer buffer]] to a string. It is a simple interface
 to `buffer.toString()` but provides additional support for utf8.

To use this module, add `require('string_decoder')` to your code.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/string_decoder/string_decoder.js?linestart=3&lineend=0&showlines=true' defer='defer'></script>

### new StringDecoder(encoding = 'utf8')
- encoding {String}  The encoding that the string is in

Creates a new `StringDecoder`.

### StringDecoder.write(buffer), String
- buffer {Buffer} The buffer to convert
(related to: Buffer.toString)

Returns a decoded string.
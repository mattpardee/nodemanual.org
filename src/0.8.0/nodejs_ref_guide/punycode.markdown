## punycode

    Stability: 2 - Unstable

[Punycode.js](https://github.com/bestiejs/punycode.js) is bundled with Node.js 0.6.2 and above. 
To use it with other Node.js versions, use `npm` to install the `punycode` 
module first.

To access Punycode in your code, add `require('punycode')`. 

### punycode.decode(str), String
- str {String} A string to decode

Converts a Punycode string of ASCII code points to a string of Unicode code
points.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/punycode/punycode.decode.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>


### punycode.encode(str), String
- str {String} A string to encode

Converts a string of Unicode code points to a Punycode string of ASCII code
points.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/punycode/punycode.encode.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>


### punycode.toUnicode(domain), String
- domain {String} A domain to convert to Unicode

Converts a Punycode string representing a domain name to Unicode. Only the
Punycoded parts of the domain name will be converted, _i.e._, it doesn't matter 
if you call it on a string that has already been converted to Unicode.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/punycode/punycode.tounicode.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

### punycode.toASCII(domain), String
- domain {String} A domain to convert to Unicode

Converts a Unicode string representing a domain name to Punycode. Only the
non-ASCII parts of the domain name will be converted, _i.e._, it doesn't matter 
if you call it with a domain that's already in ASCII.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/punycode/punycode.toascii.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

## punycode.ucs2

A UCS-2 implementation of Punycode.

### punycode.ucs2.decode(str), Array
- str {String} A String to decode

Creates an array containing the decimal code points of each Unicode character
in the string. While [JavaScript uses UCS-2
internally](http://mathiasbynens.be/notes/javascript-encoding), this function 
converts a pair of surrogate halves (each of which UCS-2 exposes as
separate characters) into a single code point, matching UTF-16.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/punycode/punycode.ucs2.decode.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

### punycode.ucs2.encode(codePoints), Array
- codePoints {Array} An array of UTF code points

Creates a string based on an array of decimal code points.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/punycode/punycode.ucs2.encode.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

### punycode.version, String

A string representing the current Punycode.js version number.

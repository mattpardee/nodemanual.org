## URL

This module has utilities for URL resolution and parsing. To use this module, add `require('url')` to your code.

Parsed URL objects have some or all of the following fields, depending on whether or not they exist in the URL string. Any parts that are not in the URL string are not in the parsed object. All the examples shown use the following URL:

`'http://user:pass@HOST.com:8080/p/a/t/h?query=string#hash'`

* `href`: the full URL that was originally parsed. Both the protocol and host are in lowercase.

  For the URL above, this is: `'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'`
  
* `protocol`: the request protocol, in lowercase.

  For the URL above, this is: `'http:'`
  
* `host`: the full lowercased host portion of the URL, including port and authentication information.

  For the URL above, this is: `'user:pass@host.com:8080'`
  
* `auth`: The authentication information from the URL.

  For the URL above, this is: `'user:pass'`
  
* `hostname`: the lowercased hostname portion of the URL.

  For the URL above, this is: `'host.com'`
  
* `port`: The port number of the URL.

  For the URL above, this is: `'8080'`
  
* `pathname`: the path section of the URL, that comes after the host and before the query, including the initial slash (if present).

  For the URL above, this is: `'/p/a/t/h'`
  
* `search`: the 'query string' portion of the URL, including the leading question mark.

  For the URL above, this is: `'?query=string'`
  
* `path`: a concatenation of `pathname` and `search`.

  For the URL above, this is: `'/p/a/t/h?query=string'`
  
* `query`: either the 'params' portion of the query string, or a querystring-parsed object.

  For the URL above, this is: `'query=string'` or `{'query':'string'}`
  
* `hash`: the 'fragment' portion of the URL including the pound-sign.

  For the URL above, this is: `'#hash'`

### Methods

@method `url.parse(urlStr, parseQueryString=false, slashesDenoteHost=false)`
@param `urlStr`: The URL string, `parseQueryString`: If true, it parses the URL using the `querystring` module, `slashesDenoteHost`: If true, `//foo/bar` acts like `{ host: 'foo', pathname: '/bar' }`, instead of `{ pathname: '//foo/bar' }`

Take a URL string, and return an object.

@method `url.format(urlObj)`
@param `urlObj`: The object to tranform into a URL

Take a parsed URL object, and return a formatted URL string that contains these properties:

* `href` is ignored.
* `protocol` is treated the same with or without the trailing `:` (colon).
  * The protocols `http`, `https`, `ftp`, `gopher`, and `file` are postfixed with `://`
  * All other protocols (like `mailto`, `xmpp`, `aim`, `sftp`, `foo`, etc) are postfixed with `:`
* `auth` is only used if `host` is absent
* `hostname` is only used if `host` is absent
* `port` is only used if `host` is absent
* `host` is only used in place of `auth`, `hostname`, and `port`
* `pathname` is treated the same with or without the leading `/` (slash)
* `search` is used in place of `query`
* `query`, a [querystring](querystring.html) object, is only used if `search` is absent
* `search` is treated the same with or without the leading `?` 
* `hash` is treated the same with or without the leading `#` 

@method `url.resolve(from, to)`
@param `from`: The base URL, `to`: An href URL

Take a base URL, and a href URL, and resolve them as a browser would for an anchor tag.

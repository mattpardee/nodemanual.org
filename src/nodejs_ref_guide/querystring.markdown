## Query String

This module provides utilities for dealing with query strings.

### Methods 

@method `querystring.escape()`

The escape function used by `querystring.stringify()`, provided so that it could be overridden if necessary.

@method `querystring.parse(str, [sep='&'], [eq='='])`
@param `str`: The query string to parse, `sep`: The separator character, `eq`: The equivalency character

Deserialize a query string to an object and returns it. You can choose to override the default separator and assignment characters.

### Example

    querystring.parse('foo=bar&baz=qux&baz=quux&corge')
    // returns
    { foo: 'bar', baz: ['qux', 'quux'], corge: '' }
    
@method `querystring.stringify(obj, [sep='&'], [eq='='])`
@param `obj`: The JSON object to serialize, `sep`: The separator character, `eq`: The equivalency character

Serialize an object to a query string and returns it. You can choose to override the default separator and assignment characters.

#### Examples

    querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' })
    // returns
    'foo=bar&baz=qux&baz=quux&corge='

    querystring.stringify({foo: 'bar', baz: 'qux'}, ';', ':')
    // returns
    'foo:bar;baz:qux'

@method `querystring.unescape`

The unescape function used by `querystring.parse()`, provided so that it could be overridden if necessary.

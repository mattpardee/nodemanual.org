## dns

> Stability: 3 - Stable

DNS is the backbone of all operations on the Internet. To access this module,
include `require('dns')` in your code.

Whenever a Node.js developer does something like `net.connect(80, 'google.com')`
or `http.get({ host: 'google.com' })`, the [[dns.lookup `dns.lookup()`]] method
is used.  All methods in the dns module use C-Ares—except for `dns.lookup()`
which uses
[`getaddrinfo(3)`](http://www.kernel.org/doc/man-pages/online/pages/man3/getaddrinfo.3.html) in a thread pool. 
C-Ares is much faster than `getaddrinfo`, but the system resolver is more constant with how other programs operate. Users who need
to do a large number of look ups quickly should use the methods that go through
C-Ares.

#### Example: Resolving `'www.google.com'`, and then reverse resolving the IP
addresses that are returned:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/dns/dns.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### dns.lookup(domain, [family=null], callback(err, address, family))
- domain {String}  The domain to resolve
- family {Number}  Indicates whether to use IPv4 (`4`) or IPv6 (`6`)
- callback {Function}  The function to execute once the method completes
- err {Error}  The error object
- address {String}  A string representation of an IPv4 or IPv6 address
- family {Number}  Either the integer `4` or `6`, and donates the address family--not necessarily the value initially passed to `lookup`

Resolves a domain (e.g. `'google.com'`) into the first found A (IPv4) or AAAA
(IPv6) record.

On error, keep in mind that `err.code` will be set to `'ENOENT'` not only when
the domain does not exist but also when the lookup fails in other ways
such as no available file descriptors.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/dns/dns.lookup.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### dns.resolve(domain, [rrtype='A'], callback(err, addresses))
- domain {String}  The domain to resolve
- rrtype {String}  The record type to use
- callback {Function}   The function to execute once the method completes
- err {Error}  The `Error` object
- addresses {String}  Determined by the record type and described in each
corresponding lookup method

Resolves a domain (e.g. `'google.com'`) into an array of the record types
specified by `rrtype`. Valid rrtypes are:

* `A` (IPV4 addresses)
* `AAAA` (IPV6 addresses)
* `MX` (mail exchange records)
* `TXT` (text records)
* `SRV` (SRV records)
* `PTR` (used for reverse IP lookups)
* `NS` (name server records)
* `CNAME` (canonical name records)

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/dns/dns.resolve.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### dns.resolve4(domain, callback(err, addresses))
- domain {String}  The domain to resolve
- callback {Function}  The function to execute once the method completes
- err {Error}  The `Error` object
- addresses {Array}  An array of IPv4 addresses (_e.g._ `['74.125.79.104',
'74.125.79.105', '74.125.79.106']`)

The same as [[dns.resolve `dns.resolve()`]], but only for IPv4 queries (`A`
records).


### dns.resolve6(domain, callback(err, addresses))
- domain {String}  The domain to resolve
- callback {Function}  The function to execute once the method completes
- err {Error}  The `Error` object
- addresses {Array}  An array of IPv6 addresses

The same as [[dns.resolve4 `dns.resolve4()`]] except for IPv6 queries (an `AAAA`
query).


### dns.resolveMx(domain, callback(err, addresses))
- domain {String}  The domain to resolve
- callback {Function}  The function to execute once the method completes
- err {Error}  The `Error` object
- addresses {Array}  An array of MX records, each with a priority and an
exchange attribute (_e.g._ `[{'priority' : 10, 'exchange' :
'mx.example.com'},{...}]`)

The same as [[dns.resolve `dns.resolve()`]], but only for mail exchange queries
(`MX` records).


### dns.resolveTxt(domain, callback(err, addresses))
- domain {String}  The domain to resolve
- callback {Function}  The function to execute once the method completes
- err {Error}  The `Error` object
- addresses {Array}  An array of text records available for `domain` (_e.g._
`['v=spf1 ip4 0.0.0.0 ~all']`)

The same as [[dns.resolve `dns.resolve()`]], but only for text queries (`TXT`
records).


### dns.resolveSrv(domain, callback(err, addresses))
- domain {String}  The domain to resolve
- callback {Function}  The function to execute once the method completes
- err {Error}  The `Error` object
- addresses {Array}  An array of the SRV records available for `domain`.
Properties of SRV records are priority, weight, port, and name (_e.g._
`[{'priority' : 10, 'weight' : 5, 'port' : 21223, 'name' :
'service.example.com'}, {...}]`)

The same as [[dns.resolve `dns.resolve()`]], but only for service records (`SRV`
records).

### dns.reverse(ip, callback(err, domains))
- ip {String}  The IP address to reverse
- callback {Function}   The function to execute once the method completes
- err {Error}  The `Error` object
- domains {Array}  An array of possible domain names

Reverse resolves an IP address to an array of domain names.

##### Error codes

Each DNS query can return one of the following error codes:

- `dns.NODATA`: DNS server returned answer with no data.
- `dns.FORMERR`: DNS server claims query was misformatted.
- `dns.SERVFAIL`: DNS server returned general failure.
- `dns.NOTFOUND`: Domain name not found.
- `dns.NOTIMP`: DNS server does not implement requested operation.
- `dns.REFUSED`: DNS server refused query.
- `dns.BADQUERY`: Misformatted DNS query.
- `dns.BADNAME`: Misformatted domain name.
- `dns.BADFAMILY`: Unsupported address family.
- `dns.BADRESP`: Misformatted DNS reply.
- `dns.CONNREFUSED`: Could not contact DNS servers.
- `dns.TIMEOUT`: Timeout while contacting DNS servers.
- `dns.EOF`: End of file.
- `dns.FILE`: Error reading file.
- `dns.NOMEM`: Out of memory.
- `dns.DESTRUCTION`: Channel is being destroyed.
- `dns.BADSTR`: Misformatted string.
- `dns.BADFLAGS`: Illegal flags specified.
- `dns.NONAME`: Given hostname is not numeric.
- `dns.BADHINTS`: Illegal hints flags specified.
- `dns.NOTINITIALIZED`: c-ares library initialization not yet performed.
- `dns.LOADIPHLPAPI`: Error loading iphlpapi.dll.
- `dns.ADDRGETNETWORKPARAMS`: Could not find GetNetworkParams function.
- `dns.CANCELLED`: DNS query cancelled.

### dns.resolveNs(domain, callback(err, addresses))
- domain {String}  The domain to resolve
- callback {Function}  The function to execute once the method completes
- err {Error}  The `Error` object
- addresses {Array}  An array of the name server records available for `domain`,
_e.g_ `['ns1.example.com', 'ns2.example.com']`

The same as [[dns.resolve `dns.resolve()`]], but only for name server records
(`NS` records).


### dns.resolveCname(domain, callback(err, addresses))
- domain {String}  The domain to resolve
- callback {Function}  The function to execute once the method completes
- err {Error}  The `Error` object
- addresses {Array}  An array of the canonical name records available for
`domain` (e.g. `['bar.example.com']`)

The same as [[dns.resolve `dns.resolve()`]], but only for canonical name records
(`CNAME` records).

Each DNS query can return one of the following error codes:

- `dns.TEMPFAIL`: timeout, SERVFAIL or similar.
- `dns.PROTOCOL`: got garbled reply.
- `dns.NXDOMAIN`: domain does not exists.
- `dns.NODATA`: domain exists but no data of reqd type.
- `dns.NOMEM`: out of memory while processing.
- `dns.BADQUERY`: the query is malformed.

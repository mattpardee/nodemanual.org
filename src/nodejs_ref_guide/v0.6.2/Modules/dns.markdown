## DNS

Whenever a user does `net.connect(80, 'google.com')` or `http.get({ host: 'google.com' })` the `dns.lookup()` method is used.  All methods in the dns module use C-Ares&mdash;except for `dns.lookup` which uses `getaddrinfo(3)` in a thread pool. C-Ares is much faster than `getaddrinfo`, but the system resolver is more constant with how other programs operate. Users who need to do a large number of look ups quickly should use the methods that go through C-Ares.

To access this module, include `require('dns')` in your code.

Here is an example which resolves `'www.google.com'` then reverse resolves the IP addresses that are returned:

    var dns = require('dns');

    dns.resolve4('www.google.com', function (err, addresses) {
      if (err) throw err;

      console.log('addresses: ' + JSON.stringify(addresses));

      addresses.forEach(function (a) {
        dns.reverse(a, function (err, domains) {
          if (err) {
            console.log('reverse for ' + a + ' failed: ' +
              err.message);
          } else {
            console.log('reverse for ' + a + ': ' +
              JSON.stringify(domains));
          }
        });
      });
    });

@method `dns.lookup(domain, family=null, callback(err, address, family))`
@param `domain`: The domain to resolve, `family`: Indicates whether to use IPv4 (`4`) or IPv6 (`6`), `callback(err, address, family)`: The function to execute once the method completes; `err` is the error object; `address` is a string representation of an IPv4 or IPv6 address; `family` is either the integer `4` or `6`, and donates the address family (not necessarily the value initially passed to `lookup`)

Resolves a domain (e.g. `'google.com'`) into the first found A (IPv4) or
AAAA (IPv6) record.

@method `dns.resolve(domain, rrtype='A', callback(err, addresses))`
@param `domain`: The domain to resolve, `rrtype`: The record type to use, `callback(err, addresses)`: The function to execute once the method completes; `err` is the `Error` object; `addresses` is determined by the record type, and described in the each corresponding lookup method below

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


@method `dns.resolve4(domain, callback(err, addresses))`
@param `domain`: The domain to resolve, `callback(err, addresses)`: The function to execute once the method completes; `err` is the `Error` object; `addresses` is an array of IPv4 addresses (_e.g._ `['74.125.79.104', '74.125.79.105', '74.125.79.106']`)

The same as `dns.resolve()`, but only for IPv4 queries (`A` records).

@method `dns.resolve6(domain, callback(err, addresses))`
@param `domain`: The domain to resolve, `callback(err, addresses)`: The function to execute once the method completes; `err` is the `Error` object; `addresses` is an array of IPv6

The same as `dns.resolve4()` except for IPv6 queries (an `AAAA` query).

@method `dns.resolveMx(domain, callback(err, addresses))`
@param `domain`: The domain to resolve, `callback(err, addresses)`: The function to execute once the method completes; `err` is the `Error` object; `addresses` is an array of MX records, each with a priority and an exchange attribute (_e.g._ `[{'priority': 10, 'exchange': 'mx.example.com'},...]`)

The same as `dns.resolve()`, but only for mail exchange queries (`MX` records).

@method `dns.resolveTxt(domain, callback(err, addresses))`
@param `domain`: The domain to resolve, `callback(err, addresses)`: The function to execute once the method completes; `err` is the `Error` object; `addresses` is an array of the text records available for `domain` (_e.g._ `['v=spf1 ip4:0.0.0.0 ~all']`)

The same as `dns.resolve()`, but only for text queries (`TXT` records).

### dns.resolveSrv(domain, callback(err, addresses))`
@param `domain`: The domain to resolve, `callback(err, addresses)`: The function to execute once the method completes; `err` is the `Error` object; `addresses` is an array of the SRV records available for `domain`. Properties of SRV records are priority, weight, port, and name (_e.g._ `[{'priority': 10, {'weight': 5, 'port': 21223, 'name': 'service.example.com'}, ...]`)

The same as `dns.resolve()`, but only for service records (`SRV` records).

@method `dns.reverse(ip, callback(err, domains))`
@param `ip`: The IP address to reverse, `callback(err, domains)`: The function to execute once the method completes; `err` is the `Error` object; `domains` is an array of possible domain names

Reverse resolves an IP address to an array of domain names.

@method `dns.resolveNs(domain, ccallback(err, domains))`
@param `domain`: The domain to reverse, `callback(err, domains)`: The function to execute once the method completes; `err` is the `Error` object; `domains` is an array of the name server records available for `domain` (_e.g_ `['ns1.example.com', 'ns2.example.com']`)

The same as `dns.resolve()`, but only for name server records (`NS` records).

@method `dns.resolveCname(domain, callback(err, domains))`
@param `domain`: The domain to reverse, `callback(err, domains)`: The function to execute once the method completes; `err` is the `Error` object; `domains` is an array of the canonical name records available for `domain` (e.g., `['bar.example.com']`)

The same as `dns.resolve()`, but only for canonical name records (`CNAME`
records).

Each DNS query can return one of the following error codes:

- `dns.TEMPFAIL`: timeout, SERVFAIL or similar.
- `dns.PROTOCOL`: got garbled reply.
- `dns.NXDOMAIN`: domain does not exists.
- `dns.NODATA`: domain exists but no data of reqd type.
- `dns.NOMEM`: out of memory while processing.
- `dns.BADQUERY`: the query is malformed.

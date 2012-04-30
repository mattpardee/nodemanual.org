/**
class tls.SecurePair

Returned by [[tls.createSecurePair `tls.createSecurePair()`]].

*/

/**
tls.SecurePair@secure()

The event is emitted from the SecurePair once the pair has successfully established a secure connection.

Similar to the checking for the server `'secureConnection'` event, [[tls.CleartextStream.authorized `tls.CleartextStream.authorized`]] should be checked to confirm whether the certificate used properly authorized.
**/ 
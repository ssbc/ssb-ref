var ipv6Addr = "2a03:2267::ba27:ebff:fe8c:5a4d:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519"
var ipv6Invite = "2a03:2267::ba27:ebff:fe8c:5a4d:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519~DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="

var R = require('../')
var tape = require('tape')

tape('ipv6 invite', function (t) {
  t.ok(R.isAddress(ipv6Addr))
  t.ok(R.isInvite(ipv6Invite))
  t.end()
})

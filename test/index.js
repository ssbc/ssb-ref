var invite1 = "net:145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=:DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="
var invite2 = "145.12.20.3:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519~DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="
var invite1ws = "ws://145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=:DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="
var multiserver1 = "net:145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc="
var multiserver2 = "onion:xyz.onion:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc="

var seed = 'DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU='
var cjdnsInvite2 = 'net:fcbc:6c66:bcd4:d3b5:2a2a:60b3:9b86:498f:8008~shs:ppdSxn1pSozJIqtDE4pYgwaQGmswCT9y15VJJcXRntI=:'+seed
var cjdnsInvite = 'fcbc:6c66:bcd4:d3b5:2a2a:60b3:9b86:498f:8008:@ppdSxn1pSozJIqtDE4pYgwaQGmswCT9y15VJJcXRntI=.ed25519~'+seed

var cjdnsAddr = 'fcbc:6c66:bcd4:d3b5:2a2a:60b3:9b86:498f:8008:@ppdSxn1pSozJIqtDE4pYgwaQGmswCT9y15VJJcXRntI=.ed25519'
var cjdnsAddr2 = 'net:fcbc:6c66:bcd4:d3b5:2a2a:60b3:9b86:498f:8008~shs:ppdSxn1pSozJIqtDE4pYgwaQGmswCT9y15VJJcXRntI='

var ipv6Addr = "2a03:2267::ba27:ebff:fe8c:5a4d:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519"
var ipv6Invite = "2a03:2267::ba27:ebff:fe8c:5a4d:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519~DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="
var ipv6AddrLocal = "::1:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519"
var ipv6InviteLocal = "::1:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519~DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="

var R = require('../')
var tape = require('tape')

tape('ipv6 invite', function (t) {
  t.ok(R.isAddress(ipv6Addr))
  t.ok(R.isAddress(cjdnsAddr))
  t.ok(R.isInvite(ipv6Invite))
  t.ok(R.isAddress(ipv6AddrLocal))
  t.ok(R.isAddress(cjdnsAddr))
  t.ok(R.isAddress(cjdnsAddr2))
  t.ok(R.isInvite(ipv6InviteLocal))
  t.end()
})

tape('multiserver invite', function (t) {
  var rand = Math.random()
  t.ok(R.isMultiServerInvite(invite1))
  t.deepEqual(
    R.parseMultiServerInvite(invite1),
    {
      invite: invite1,
      remote: 'net:145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=',
      key: '@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519',
      redirect: null
    })
  t.deepEqual(
    R.parseInvite(invite1ws),
    {
      invite: invite1ws,
      remote: 'ws://145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=',
      key: '@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519',
      redirect: null
    })
  t.deepEqual(
    R.parseMultiServerInvite(invite1+'#'+rand),
    {
      invite: invite1,
      remote: 'net:145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=',
      key: '@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519',
      redirect: '#'+rand
    })

  t.deepEqual(
    R.parseInvite(cjdnsInvite2+'#'+rand),
    {
      invite: cjdnsInvite2,
      remote: 'net:fcbc:6c66:bcd4:d3b5:2a2a:60b3:9b86:498f:8008~shs:ppdSxn1pSozJIqtDE4pYgwaQGmswCT9y15VJJcXRntI=',
      key: '@ppdSxn1pSozJIqtDE4pYgwaQGmswCT9y15VJJcXRntI=.ed25519',
      redirect: '#'+rand
    })

  t.deepEqual(
    R.parseInvite(cjdnsInvite+'#'+rand),
    {
      invite: cjdnsInvite2,
      remote: 'net:fcbc:6c66:bcd4:d3b5:2a2a:60b3:9b86:498f:8008~shs:ppdSxn1pSozJIqtDE4pYgwaQGmswCT9y15VJJcXRntI=',
      key: '@ppdSxn1pSozJIqtDE4pYgwaQGmswCT9y15VJJcXRntI=.ed25519',
      redirect: '#'+rand
    })


  t.end()
})

tape('legacy invite', function (t) {
  var rand = Math.random()
  t.ok(R.isLegacyInvite(invite2))
  t.deepEqual(
    R.parseLegacyInvite(invite2),
    {
      invite: invite1,
      remote: 'net:145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=',
      key: '@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519',
      redirect: null
    })

  t.deepEqual(
    R.parseLegacyInvite(invite2+'#'+rand),
    {
      invite: invite1,
      remote: 'net:145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=',
      key: '@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519',
      redirect: '#'+rand
    })
  t.end()
})

tape('parse multiserver address to legacy', function (t) {

  t.ok(R.isAddress(multiserver1))
  t.deepEqual(R.parseAddress(multiserver1), {
    host: "145.12.20.3",
    port :8080,
    key: "@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519"
  })

  t.end()

})

tape('check that onions pass', function (t) {

  t.ok(R.isAddress(multiserver2))
  t.end()

})

var msgRef = '%pGzeEydYdHjKW1iIchR0Yumydsr3QSp8+FuYcwVwi8Q=.sha256'
var msgUrls = [
  'http://localhost:7777/#/msg/%25pGzeEydYdHjKW1iIchR0Yumydsr3QSp8%2BFuYcwVwi8Q%3D.sha256',
  'http://localhost:7777/#/msg/%pGzeEydYdHjKW1iIchR0Yumydsr3QSp8+FuYcwVwi8Q=.sha256',
  'http://localhost:7777/%25pGzeEydYdHjKW1iIchR0Yumydsr3QSp8%2BFuYcwVwi8Q%3D.sha256',
  'http://localhost:7777/%pGzeEydYdHjKW1iIchR0Yumydsr3QSp8+FuYcwVwi8Q=.sha256',
  'http://localhost:7777/%25pGzeEydYdHjKW1iIchR0Yumydsr3QSp8%2BFuYcwVwi8Q%3D.sha256?foo=bar',
  'http://localhost:7777/%pGzeEydYdHjKW1iIchR0Yumydsr3QSp8+FuYcwVwi8Q=.sha256?foo=bar'
]
var feedRef = '@jEA8WSl0URsB/g/XYG5zCGBkMOyTeBZfGtbw3RJMIuk=.ed25519'
var feedUrls = [
  'http://localhost:7777/#/profile/%40jEA8WSl0URsB%2Fg%2FXYG5zCGBkMOyTeBZfGtbw3RJMIuk%3D.ed25519',
  'http://localhost:7777/#/profile/@jEA8WSl0URsB/g/XYG5zCGBkMOyTeBZfGtbw3RJMIuk=.ed25519',
  'http://localhost:7777/%40jEA8WSl0URsB%2Fg%2FXYG5zCGBkMOyTeBZfGtbw3RJMIuk%3D.ed25519',
  'http://localhost:7777/@jEA8WSl0URsB/g/XYG5zCGBkMOyTeBZfGtbw3RJMIuk=.ed25519',
  'http://localhost:7777/%40jEA8WSl0URsB%2Fg%2FXYG5zCGBkMOyTeBZfGtbw3RJMIuk%3D.ed25519?foo=bar',
  'http://localhost:7777/@jEA8WSl0URsB/g/XYG5zCGBkMOyTeBZfGtbw3RJMIuk=.ed25519?foo=bar'
]
var blobRef = '&51ZXxNYIvTDCoNTE9R94NiEg3JAZAxWtKn4h4SmBwyY=.sha256'
var blobUrls = [
  'http://localhost:7777/#/blob/%2651ZXxNYIvTDCoNTE9R94NiEg3JAZAxWtKn4h4SmBwyY%3D.sha256',
  'http://localhost:7777/#/blob/&51ZXxNYIvTDCoNTE9R94NiEg3JAZAxWtKn4h4SmBwyY=.sha256',
  'http://localhost:7777/%2651ZXxNYIvTDCoNTE9R94NiEg3JAZAxWtKn4h4SmBwyY%3D.sha256',
  'http://localhost:7777/&51ZXxNYIvTDCoNTE9R94NiEg3JAZAxWtKn4h4SmBwyY=.sha256',
  'http://localhost:7777/%2651ZXxNYIvTDCoNTE9R94NiEg3JAZAxWtKn4h4SmBwyY%3D.sha256?foo=bar',
  'http://localhost:7777/&51ZXxNYIvTDCoNTE9R94NiEg3JAZAxWtKn4h4SmBwyY=.sha256?foo=bar',
  'http://localhost:7777/&amp;51ZXxNYIvTDCoNTE9R94NiEg3JAZAxWtKn4h4SmBwyY=.sha256?foo=bar'
]

tape('extract', function (t) {
  msgUrls.forEach(function (url) {
    t.equal(R.extract(url), msgRef)
  })
  feedUrls.forEach(function (url) {
    t.equal(R.extract(url), feedRef)
  })
  blobUrls.forEach(function (url) {
    t.equal(R.extract(url), blobRef)
  })
  t.end()
})





















var ipv6Addr = "2a03:2267::ba27:ebff:fe8c:5a4d:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519"
var ipv6Invite = "2a03:2267::ba27:ebff:fe8c:5a4d:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519~DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="
var ipv6AddrLocal = "::1:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519"
var ipv6InviteLocal = "::1:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519~DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="

var R = require('../')
var tape = require('tape')

tape('ipv6 invite', function (t) {
  t.ok(R.isAddress(ipv6Addr))
  t.ok(R.isInvite(ipv6Invite))
  t.ok(R.isAddress(ipv6AddrLocal))
  t.ok(R.isInvite(ipv6InviteLocal))
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



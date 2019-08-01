var invite1 = "net:145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=:DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="
var invite2 = "145.12.20.3:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519~DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="
var multiserver1 = "net:145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc="
var multiserver2 = "onion:xyz.onion:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc="

var cjdnsAddr = 'fcbc:6c66:bcd4:d3b5:2a2a:60b3:9b86:498f:8008:@ppdSxn1pSozJIqtDE4pYgwaQGmswCT9y15VJJcXRntI=.ed25519'
var cjdnsAddr2 = 'net:fcbc:6c66:bcd4:d3b5:2a2a:60b3:9b86:498f:8008~shs:ppdSxn1pSozJIqtDE4pYgwaQGmswCT9y15VJJcXRntI='

var ipv6Addr = "2a03:2267::ba27:ebff:fe8c:5a4d:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519"
var ipv6Invite = "2a03:2267::ba27:ebff:fe8c:5a4d:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519~DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="
var ipv6AddrLocal = "::1:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519"
var ipv6InviteLocal = "::1:8080:@gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=.ed25519~DxiHEv+ds+zUzA49efDgZk8ssGeqrp/5kgvRVzTM7vU="

var blob = "&abcdefg6bIh5dmyss7QH7uMrQxz3LKvgjer68we30aQ=.sha256"
var secretBlob = "&abcdefg6bIh5dmyss7QH7uMrQxz3LKvgjer68we30aQ=.sha256?unbox=abcdefgqAYfzLrychmP5KchZ6JaLHyYv1aYOviDnSZk=.boxs&another=test"
var secretMessage = "%WgVG9T2IryRoPMCQk7znuMt2Cmo/shgnrbn0wY6gc3M=.sha256?unbox=AZlrtZIJQiHqgwCaB0GgtIiFXha+XN5y6n5NJz/HtunP"

var msg_id = '%YPqekTHlErYzPzzonLC29mrkofpPDuQbUh+DgQYD6H4=.sha256'

var R = require('../')
var tape = require('tape')

tape('msg', function (t) {
  t.ok(R.isMsg(msg_id))
  t.ok(R.isLink(msg_id))
  t.ok(R.isMsgLink(msg_id))
  t.end()
})

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
      key: 'gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=',
      redirect: null
    })
  t.deepEqual(
    R.parseMultiServerInvite(invite1+'#'+rand),
    {
      invite: invite1,
      remote: 'net:145.12.20.3:8080~shs:gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=',
      key: 'gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=',
      redirect: '#'+rand
    })

  t.equal(R.getKeyFromAddress(invite1), 'gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc=')

  t.end()
})

tape('legacy invite', function (t) {
  t.ok(R.isLegacyInvite(invite2))
  t.end()
})

tape('parse multiserver address to legacy', function (t) {

  var objAddr = {
    host: "145.12.20.3",
    port :8080,
    key: "gYCJpN4eGDjHFnWW2Fcusj8O4QYbVDUW6rNYh7nNEnc="
  }

  t.ok(R.isAddress(multiserver1))
  t.deepEqual(R.parseAddress(multiserver1), objAddr)

  t.ok(R.isAddress(objAddr))
  t.notOk(R.isAddress({}))


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

tape('extract with non url-encoded links', function (t) {
  var messageIdWithNumberAtStart = '%09abcdefghyq9KH6dYMc/g17L04jDbl1py8arGQmL1I=.sha256'
  t.equal(R.extract(messageIdWithNumberAtStart), messageIdWithNumberAtStart)
  t.equal(R.extract(encodeURIComponent(messageIdWithNumberAtStart)), messageIdWithNumberAtStart)
  t.equal(R.extract(encodeURIComponent(msgRef)), msgRef)
  t.equal(R.extract(msgRef), msgRef)
  t.end()
})

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

tape('alternative feed type', (t) => {
  const newFeedType = 'whatever'
  const newFeedId = feedRef.replace('ed25519', newFeedType)
  t.equal(R.isFeedId(newFeedId), false)
  R.use(newFeedType)
  t.equal(R.isFeedId(newFeedId), true)
  t.end()
})

tape('parse link', function (t) {
  t.deepEqual(R.parseLink(secretMessage), {
    link: "%WgVG9T2IryRoPMCQk7znuMt2Cmo/shgnrbn0wY6gc3M=.sha256",
    query: {
      unbox: "AZlrtZIJQiHqgwCaB0GgtIiFXha+XN5y6n5NJz/HtunP"
    }
  })
  t.ok(R.isMsgLink(secretMessage))
  t.end()
})

tape('blob', function (t) {
  t.ok(R.isBlob(blob))

  // shouldn't accept a blob with a query string
  // this should be handled by parseLink
  t.notOk(R.isBlob(secretBlob))

  var link = R.parseLink(blob)

  t.deepEqual(link, {
    link: blob
  })

  t.ok(R.isBlob(link.link))

  t.deepEqual(R.parseLink(secretBlob), {
    link: "&abcdefg6bIh5dmyss7QH7uMrQxz3LKvgjer68we30aQ=.sha256",
    query: {
      unbox: "abcdefgqAYfzLrychmP5KchZ6JaLHyYv1aYOviDnSZk=.boxs",
      another: "test"
    }
  })

  t.end()
})

tape('urls', function (t) {
  var url = 'http://example.com'
  t.equal(R.type(url), false)
  t.equal(R.isAddress(url), false)
  t.equal(R.isMultiServerInvite(url), false)
  t.equal(R.isInvite(url), false)
  t.equal(R.isMsg(url), false)
  t.equal(R.isBlob(url), false)
  t.equal(R.isFeed(url), false)
  t.equal(R.isLink(url), false)
  t.equal(R.getKeyFromAddress(url), undefined)

  t.end()
})

tape('urls', function (t) {
  var url = 'http://example.com'
  t.equal(R.type(url), false)
  t.equal(R.isAddress(url), false)
  t.equal(R.isMultiServerInvite(url), false)
  t.equal(R.isInvite(url), false)
  t.equal(R.isMsg(url), false)
  t.equal(R.isBlob(url), false)
  t.equal(R.isFeed(url), false)
  t.equal(R.isLink(url), false)
  t.equal(R.getKeyFromAddress(url), undefined)

  t.end()
})




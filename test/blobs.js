var tape = require('tape')
var R = require('../')

var blob = '&abcdefg6bIh5dmyss7QH7uMrQxz3LKvgjer68we30aQ=.sha256'
var secretBlob = '&abcdefg6bIh5dmyss7QH7uMrQxz3LKvgjer68we30aQ=.sha256?unbox=abcdefgqAYfzLrychmP5KchZ6JaLHyYv1aYOviDnSZk=.boxs&another=test'

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
    link: '&abcdefg6bIh5dmyss7QH7uMrQxz3LKvgjer68we30aQ=.sha256',
    query: {
      unbox: 'abcdefgqAYfzLrychmP5KchZ6JaLHyYv1aYOviDnSZk=.boxs',
      another: 'test'
    }
  })

  t.end()
})

tape('extract (blob)', function (t) {
  blobUrls.forEach(function (url) {
    t.equal(R.extract(url), blobRef)
  })
  t.end()
})

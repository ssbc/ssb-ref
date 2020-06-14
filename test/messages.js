var tape = require('tape')
var R = require('../')

var msgId = '%YPqekTHlErYzPzzonLC29mrkofpPDuQbUh+DgQYD6H4=.sha256'
var secretMessage = '%WgVG9T2IryRoPMCQk7znuMt2Cmo/shgnrbn0wY6gc3M=.sha256?unbox=AZlrtZIJQiHqgwCaB0GgtIiFXha+XN5y6n5NJz/HtunP'
var cloaked = '%zoYYzPzPqekTHlErnLC29mrkofpPDuQbUh+DgQYD6H4=.cloaked'

tape('msg', function (t) {
  t.ok(R.isMsg(msgId))
  t.false(R.isMsg('%cat=.sha256'))
  t.ok(R.isLink(msgId))
  t.ok(R.isMsgLink(msgId))

  t.true(R.isCloakedMsg(cloaked))
  t.false(R.isCloakedMsg(msgId))
  t.end()
})

tape('parse link', function (t) {
  t.deepEqual(R.parseLink(secretMessage), {
    link: '%WgVG9T2IryRoPMCQk7znuMt2Cmo/shgnrbn0wY6gc3M=.sha256',
    query: {
      unbox: 'AZlrtZIJQiHqgwCaB0GgtIiFXha+XN5y6n5NJz/HtunP'
    }
  })
  t.ok(R.isMsgLink(secretMessage))
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

tape('extract (message)', function (t) {
  msgUrls.forEach(function (url) {
    t.equal(R.extract(url), msgRef)
  })
  t.end()
})

tape('extract with non url-encoded links', function (t) {
  var messageIdWithNumberAtStart = '%09abcdefghyq9KH6dYMc/g17L04jDbl1py8arGQmL1I=.sha256'
  t.equal(R.extract(messageIdWithNumberAtStart), messageIdWithNumberAtStart)
  t.equal(R.extract(encodeURIComponent(messageIdWithNumberAtStart)), messageIdWithNumberAtStart)
  t.equal(R.extract(encodeURIComponent(msgRef)), msgRef)
  t.equal(R.extract(msgRef), msgRef)
  t.end()
})

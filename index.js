var isDomain = require('is-valid-domain')
var rx = require('ip-regex')({exact: true})
var isIP = rx.test.bind(rx)

var isInteger = Number.isInteger

function isString(s) {
  return 'string' === typeof s
}

var hasLink = exports.hasLink =
  function (data) {
    return /(@|%|&)[A-Za-z0-9\/+]{43}=\.[\w\d]+$/.exec(data)
  }

var hasFeedId = exports.hasFeed = exports.hasFeedId =
  function (data) {
    return /(@[A-Za-z0-9\/+]{43}=\.(?:sha256|ed25519))/.exec(data)
  }

var hasMsgId = exports.hasMsg = exports.hasMsgId =
  function (data) {
    return /(%[A-Za-z0-9\/+]{43}=\.sha256)/.exec(data)
  }

var hasBlobId = exports.hasBlob = exports.hasBlobId =
  function (data) {
    return /(&[A-Za-z0-9\/+]{43}=\.sha256)/.exec(data)
  }

var hasTagId = exports.hasTag = exports.hasTagId =
  function (data) {
    return /(#[A-Za-z0-9\/+]{43}=\.sha256)/.exec(data)
  }

var hasAddress = exports.hasAddress =
  function (data) {
    if(!isString(data)) return false
  var parts = data.split(':')

  return (
    parts.length === 3
    && hasFeedId(parts[2])
    && hasInteger(+parts[1])
    && (
      isIP(parts[0])
      || isDomain(parts[0])
      || parts[0] === 'localhost'
    )
  )
}

var hasInvite = exports.hasInvite =
  function (data) {
    if(!isString(data)) return false
    var parts = data.split('~')
    //console.log(parts, isAddress(parts[0]), /^[A-Za-z0-9\/+]{43}=$/.test(parts[1]))
    return parts.length == 2 && hasAddress(parts[0]) ?  /([A-Za-z0-9\/+]{43}=)/.exec(parts[1]) : false
  }

var mentionIt = exports.mentionIt = 
  function (data){
    if(!isString(data)) return false
    var mentions = ['hasInvite', 'hasBlob', 'hasMsg', 'hasFeed', 'hasInvite'].reduce(function(a, e){
      var i = 0
      var str = data
      var t = exports[e](str)
      var r = []
      while(t){
        console.log( t)
        var mention = {}
        mention.link = t[0]
        r.push(mention)
        str = str.slice(t.index + t[0].length)
        console.log('string ring: ' + str) 
        t = exports[e](str)
      }
      return a.concat(r)
    }, [])
    return mentions
  }

var isLink = exports.isLink =
  function (data) {
    return isString(data) && /^(@|%|&)[A-Za-z0-9\/+]{43}=\.[\w\d]+$/.test(data)
  }

var isFeedId = exports.isFeed = exports.isFeedId =
  function (data) {
    return isString(data) && /^@[A-Za-z0-9\/+]{43}=\.(?:sha256|ed25519)$/.test(data)
  }

var isMsgId = exports.isMsg = exports.isMsgId =
  function (data) {
    return isString(data) && /^%[A-Za-z0-9\/+]{43}=\.sha256$/.test(data)
  }

var isBlobId = exports.isBlob = exports.isBlobId =
  function (data) {
    return isString(data) && /^&[A-Za-z0-9\/+]{43}=\.sha256$/.test(data)
  }

var isTagId = exports.isTag = exports.isTagId =
  function (data) {
    return isString(data) && /^#[A-Za-z0-9\/+]{43}=\.sha256$/.test(data)
  }

var isAddress = exports.isAddress =
  function (data) {
    if(!isString(data)) return false
  var parts = data.split(':')

  return (
    parts.length === 3
    && isFeedId(parts[2])
    && isInteger(+parts[1])
    && (
      isIP(parts[0])
      || isDomain(parts[0])
      || parts[0] === 'localhost'
    )
  )
}

var isInvite = exports.isInvite =
  function (data) {
    if(!isString(data)) return false
    var parts = data.split('~')
    //console.log(parts, isAddress(parts[0]), /^[A-Za-z0-9\/+]{43}=$/.test(parts[1]))
    return parts.length == 2 && isAddress(parts[0]) && /^[A-Za-z0-9\/+]{43}=$/.test(parts[1])
  }

exports.type =
  function (id) {
    if(!isString(id)) return false
    var c = id.charAt(0)
    if (c == '@' && isFeedId(id))
      return 'feed'
    else if (c == '%' && isMsgId(id))
      return 'msg'
    else if (c == '&' && isBlobId(id))
      return 'blob'
    else if(isAddress(id)) return 'address'
    else if(isInvite(id)) return 'invite'
    else
    return false
  }

var isDomain = require('is-valid-domain')
var rx = require('ip-regex')({exact: true})
var isIP = rx.test.bind(rx)

var isInteger = Number.isInteger

function isString(s) {
  return 'string' === typeof s
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

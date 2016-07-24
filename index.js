var isDomain = require('is-valid-domain')
var ip = require('ip')

function isIP (s) {
  return ip.isV4Format(s) || ip.isV6Format(s)
}

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
  var id = parts.pop(), port = parts.pop(), addr = parts.join(':')
  return (
    isFeedId(id) && isInteger(+port)
    && (isIP(addr) || isDomain(addr) || addr === 'localhost')
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

exports.extract =
  function (data) {
    if (!isString(data))
      return false

    var _data = data
    try { _data = decodeURIComponent(data) }
    catch (e) {} // this may fail if it's not encoded, so don't worry if it does
    _data = _data.replace(/&amp;/g, '&')

    var res = /([@%&][A-Za-z0-9\/+]{43}=\.[\w\d]+)/.exec(_data)
    return res && res[0]
  }



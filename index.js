var isDomain = require('is-valid-domain')
var ip = require('ip')

function isIP (s) {
  return ip.isV4Format(s) || ip.isV6Format(s)
}

var isInteger = Number.isInteger
var DEFAULT_PORT = 8008

function isString(s) {
  return 'string' === typeof s
}

var isHost = function (addr) {
  return ('string' === typeof addr && isIP(addr)) || isDomain(addr) || addr === 'localhost'
}

var isPort = function (p) {
  return isInteger(p) && p <= 65536
}

function isObject (o) {
  return o && 'object' === typeof o && !Array.isArray(o)
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

var parseMultiServerAddress = function (data) {
    if(!isString(data)) return false
  if(!/^\w+\:.+~shs\:/.test(data)) return false
  data = data.split('~').map(function (e) {
    return e.split(':')
  })

  if(data.length != 2) return false
  if(data[0].length != 3) return false
  if(!(data[1].length == 2 || data[1].length == 3)) return false
  if(data[0][0] !== 'net' && data[0][0] !== 'onion') return false
  if(data[1][0] !== 'shs') return false

  var host = data[0][1]
  var port = +data[0][2]
  var key = '@'+data[1][1]+'.ed25519'
  var seed = data[1][2]

  if(!(isHost(host) && isPort(+port) && isFeedId(key))) return false
  var addr = {
    host: host,
    port: port,
    key: key,
  }
  if(seed)
    addr.seed = seed

  return addr
}

var isAddress = exports.isAddress = function (data) {
  var host, port, id
  if(isObject(data)) {
    id = data.key
    host = data.host
    port = data.port
  }
  else if(!isString(data)) return false
  else if(parseMultiServerAddress(data)) return true
  else {
    var parts = data.split(':')
    var id = parts.pop(), port = parts.pop(), host = parts.join(':')
  }
  return (
    isFeedId(id) && isInteger(+port)
    && isHost(host)
  )
}

var parseAddress = exports.parseAddress = function (e) {
  if(isString(e)) {
    if(~e.indexOf('~'))
      return parseMultiServerAddress(e)
    var parts = e.split(':')
    var id = parts.pop(), port = parts.pop(), host = parts.join(':')
    var e = {
      host: host,
      port: +(port || DEFAULT_PORT),
      key: id
    }
    return e
  }
  return e
}

var toAddress = exports.toAddress = function (e) {
  e = exports.parseAddress(e)
  e.port = e.port || DEFAULT_PORT
  e.host = e.host || 'localhost'
  return e
}


var isLegacyInvite = exports.isLegacyInvite =
  function (data) {
    if(!isString(data)) return false
    var parts = data.split('~')
    return parts.length == 2 && isAddress(parts[0]) && /^[A-Za-z0-9\/+]{43}=$/.test(parts[1])
  }

var isMultiServerInvite = exports.isMultiServerInvite =
  function (data) {
    if(!isString(data)) return false
    return !!parseMultiServerInvite(data)
  }

var isInvite = exports.isInvite =
  function (data) {
    if(!isString(data)) return false
    return isLegacyInvite(data) || isMultiServerInvite(data)
  }


function parseLegacyInvite (invite) {
  var redirect = invite.split('#')
  invite = redirect.shift()
  var parts = invite.split('~')
  var addr = toAddress(parts[0])//.split(':')
  //convert legacy code to multiserver invite code.
  var remote = 'net:'+addr.host+':'+addr.port+'~shs:'+addr.key.slice(1, -8)
  invite = remote+':'+parts[1]
  return {
    invite: remote + ':' + parts[1],
    key: addr.key,
    redirect: null,
    remote: remote,
    redirect: redirect.length ? '#' + redirect.join('#') : null
  }
}

function parseMultiServerInvite (invite) {

  var redirect = invite.split('#')
  if(!redirect.length) return null

  invite = redirect.shift()

  var parts = invite.split('~')
  .map(function (e) { return e.split(':') })

  if(parts.length !== 2) return null
  if(!/^(net|wss?)$/.test(parts[0][0])) return null
  if(parts[1][0] !== 'shs') return null
  if(parts[1].length !== 3) return null
  var p2 = invite.split(':')
  p2.pop()

  return {
    invite: invite,
    remote: p2.join(':'),
    key: '@'+parts[1][1]+'.ed25519',
    redirect: redirect.length ? '#' + redirect.join('#') : null
  }
}

exports.parseLegacyInvite = parseLegacyInvite
exports.parseMultiServerInvite = parseMultiServerInvite

exports.parseInvite = function (invite) {
  return (
    isLegacyInvite(invite)
  ? parseLegacyInvite(invite)
  : isMultiServerInvite(invite)
  ? parseMultiServerInvite(invite)
  : null
  )
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




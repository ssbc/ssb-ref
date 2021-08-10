var isCanonicalBase64 = require('is-canonical-base64')
var isDomain = require('is-valid-domain')
var Querystring = require('querystring')
var ip = require('ip')
var MultiServerAddress = require('multiserver-address')

/* classic ssb definitions */
var parseLinkRegex = /^((@|%|&)[A-Za-z0-9/+]{43}=\.[\w\d]+)(\?(.+))?$/
var feedIdRegex = exports.feedIdRegex = isCanonicalBase64('@', '.(?:sha256|ed25519)', 32)
var msgIdRegex = exports.msgIdRegex = isCanonicalBase64('%', '.sha256', 32)
var blobIdRegex = exports.blobIdRegex = isCanonicalBase64('&', '.sha256', 32)

/* BFE type checks for strings */
var SUFFIX = '\\.[a-zA-Z\\d-]+'
var feedTypeIdRegex = exports.feedTypeIdRegex = isCanonicalBase64('@', SUFFIX)
var msgTypeIdRegex = exports.msgTypeIdRegex = isCanonicalBase64('%', SUFFIX)
var blobTypeIdRegex = exports.blobTypeIdRegex = isCanonicalBase64('&', SUFFIX)

var cloakedMsgIdRegex = exports.cloakedMsgIdRegex = isCanonicalBase64('%', '.cloaked', 32)

var extractRegex = /([@%&][A-Za-z0-9/+]{43}=\.[\w\d]+)/

var DEFAULT_PORT = 8008

/* basic validators */
function isString (s) { return typeof s === 'string' }
function isObject (o) { return o && typeof o === 'object' && !Array.isArray(o) }
var isInteger = Number.isInteger
function isIP (s) {
  return ip.isV4Format(s) || ip.isV6Format(s)
}
function isHost (addr) {
  if (!isString(addr)) return
  addr = addr.replace(/^wss?:\/\//, '')
  return (isIP(addr)) || isDomain(addr) || addr === 'localhost'
}
function isPort (p) {
  return isInteger(p) && p <= 65536
}
function isMultiServerAddress (str) {
  // a http url fits into the multiserver scheme,
  // but all ssb address must have a transport and a transform
  // so check there is at least one unescaped ~ in the address
  return MultiServerAddress.check(str) && /[^!][~]/.test(str)
}

/* feed */
var isFeedId = exports.isFeed = exports.isFeedId =
  function (data) {
    return isString(data) && feedIdRegex.test(data)
  }
exports.isFeedType = exports.isFeedTypeId =
  function (data) {
    return isString(data) && feedTypeIdRegex.test(data)
  }

/* msg */
var isMsgId = exports.isMsg = exports.isMsgId =
  function (data) {
    return isString(data) && msgIdRegex.test(data)
  }
exports.isMsgType = exports.isMsgTypeId =
  function (data) {
    return isString(data) && msgTypeIdRegex.test(data)
  }
exports.isCloakedMsg = exports.isCloakedMsgId =
  function (data) {
    return isString(data) && cloakedMsgIdRegex.test(data)
  }

/* blob */
var isBlobId = exports.isBlob = exports.isBlobId =
  function (data) {
    return isString(data) && blobIdRegex.test(data)
  }
exports.isBlobType = exports.isBlobTypeId =
  function (data) {
    return isString(data) && blobTypeIdRegex.test(data)
  }

var isLink = exports.isLink =
  function (data) {
    if (!isString(data)) return false
    var index = data.indexOf('?')
    data = ~index ? data.substring(0, index) : data
    return isString(data) && (isFeedId(data) || isMsgId(data) || isBlobId(data))
  }
exports.isBlobLink = function (s) {
  return s[0] === '&' && isLink(s)
}
exports.isMsgLink = function (s) {
  return s[0] === '%' && isLink(s)
}

exports.normalizeChannel =
  function (data) {
    if (typeof data === 'string') {
      data = data.toLowerCase().replace(/\s|,|\.|\?|!|<|>|\(|\)|\[|\]|"|#/g, '')
      if (data.length > 0) {
        return data.slice(0, 30)
      }
    }
    return null
  }

function deprecate (name, fn) {
  var logged = false
  return function () {
    var args = [].slice.call(arguments)
    if (!logged) {
      console.trace('deprecated api used: ' + name)
      logged = true
    }
    return fn.apply(this, args)
  }
}

var parseMultiServerAddress = function (data) {
  if (!isString(data)) return false
  if (!MultiServerAddress.check(data)) return false

  var addr = MultiServerAddress.decode(data)
  addr = addr.find(function (address) {
    if (!address[0]) return false
    if (!address[1]) return false
    return /^(net|wss?|onion)$/.test(address[0].name) && /^shs/.test(address[1].name)
  })
  if (!Array.isArray(addr)) {
    return false
  }
  var port = +addr[0].data.pop() // last item always port, to handle ipv6

  // preserve protocol type on websocket addresses
  var host = (/^wss?$/.test(addr[0].name) ? addr[0].name + ':' : '') + addr[0].data.join(':')
  var key = '@' + addr[1].data[0] + '.ed25519'
  var seed = addr[1].data[2]
  // allow multiserver addresses that are not currently understood!
  if (!(isHost(host) && isPort(+port) && isFeedId(key))) return false
  var address = {
    host: host,
    port: port,
    key: key
  }
  if (seed) { address.seed = seed }

  return address
}

var toLegacyAddress = parseMultiServerAddress
exports.toLegacyAddress = deprecate('ssb-ref.toLegacyAddress', toLegacyAddress)

exports.isLegacyAddress = function (addr) {
  return isObject(addr) && isHost(addr.host) && isPort(addr.port) && isFeedId(addr.key)
}

var toMultiServerAddress = exports.toMultiServerAddress = function (addr) {
  if (MultiServerAddress.check(addr)) return addr
  if (!isPort(addr.port)) throw new Error('ssb-ref.toMultiServerAddress - invalid port:' + addr.port)
  if (!isHost(addr.host)) throw new Error('ssb-ref.toMultiServerAddress - invalid host:' + addr.host)
  if (!isFeedId(addr.key)) throw new Error('ssb-ref.toMultiServerAddress - invalid key:' + addr.key)

  return (
    /^wss?:/.test(addr.host) ? addr.host
      : /\.onion$/.test(addr.host) ? 'onion:' + addr.host
        : 'net:' + addr.host
  ) + ':' + addr.port + '~shs:' + addr.key.substring(1, addr.key.indexOf('.'))
}

var isAddress = exports.isAddress = function (data) {
  var host, port, id
  if (isObject(data)) {
    id = data.key; host = data.host; port = data.port
  } else if (!isString(data)) return false
  else if (isMultiServerAddress(data)) return true
  else {
    var parts = data.split(':')
    id = parts.pop(); port = parts.pop(); host = parts.join(':')
  }
  return (
    isFeedId(id) && isPort(+port) &&
    isHost(host)
  )
}

// This is somewhat fragile, because maybe non-shs protocols get added...
// it would be better to treat all addresses as opaque or have multiserver handle
// extraction of a signing key from the address.
exports.getKeyFromAddress = function (addr) {
  if (addr.key) return addr.key
  try {
    var data = MultiServerAddress.decode(addr)
  } catch (err) {
    console.error(new Error('Attempted connection with malformed multiserver-address ' + addr))
  }
  if (!data) return undefined
  for (var k in data) {
    var address = data[k]
    for (var j in address) {
      var protocol = address[j]
      if (/^shs/.test(protocol.name)) {
        // forwards compatible with future shs versions...
        return '@' + protocol.data[0] + '.ed25519'
      }
    }
  }
}

var parseAddress = function (e) {
  if (isString(e)) {
    if (~e.indexOf('~')) { return parseMultiServerAddress(e) }
    var parts = e.split(':')
    var id = parts.pop(); var port = parts.pop(); var host = parts.join(':')
    e = {
      host: host,
      port: +(port || DEFAULT_PORT),
      key: id
    }
    return e
  }
  return e
}
exports.parseAddress = deprecate('ssb-ref.parseAddress', parseAddress)

var toAddress = exports.toAddress = function (e) {
  e = parseAddress(e)
  e.port = e.port || DEFAULT_PORT
  e.host = e.host || 'localhost'
  return e
}

var legacyInviteRegex = /^[A-Za-z0-9/+]{43}=$/
var legacyInviteFixerRegex = /#.*$/
var isLegacyInvite = exports.isLegacyInvite =
  function (data) {
    if (!isString(data)) return false
    data = data.replace(legacyInviteFixerRegex, '')
    var parts = data.split('~')
    return parts.length === 2 && isAddress(parts[0]) && legacyInviteRegex.test(parts[1])
  }

var isMultiServerInvite = exports.isMultiServerInvite =
  function (data) {
    if (!isString(data)) return false
    return !!parseMultiServerInvite(data)
  }

var isInvite = exports.isInvite =
  function (data) {
    if (!isString(data)) return false
    return isLegacyInvite(data) || isMultiServerInvite(data)
  }

exports.parseLink = function parseBlob (ref) {
  var match = parseLinkRegex.exec(ref)
  if (match && match[1]) {
    if (match[3]) {
      var query = Querystring.parse(match[4])
      // unbox keys have a '+' in them that is parsed into a ' ', this changes it back
      if (isString(query.unbox)) query.unbox = query.unbox.replace(/ /g, '+')
      return { link: match[1], query }
    } else {
      return { link: match[1] }
    }
  }
}

function parseLegacyInvite (invite) {
  var redirect = invite.split('#')
  invite = redirect.shift()
  var parts = invite.split('~')
  var addr = toAddress(parts[0])// .split(':')
  // convert legacy code to multiserver invite code.
  var remote = toMultiServerAddress(addr)
  invite = remote + ':' + parts[1]
  return {
    invite: remote + ':' + parts[1],
    key: addr.key,
    remote: remote,
    redirect: redirect.length ? '#' + redirect.join('#') : null
  }
}

function parseMultiServerInvite (invite) {
  var redirect = invite.split('#')
  if (!redirect.length) return null

  invite = redirect.shift()
  var addr = toLegacyAddress(invite)
  if (!addr) return null
  delete addr.seed
  return {
    invite: invite,
    remote: toMultiServerAddress(addr),
    key: addr.key,
    redirect: redirect.length ? '#' + redirect.join('#') : null
  }
}

exports.parseLegacyInvite = deprecate('ssb-ref.parseLegacyInvite', parseLegacyInvite)
exports.parseMultiServerInvite = deprecate('ssb-ref.parseMultiServerInvite', parseMultiServerInvite)

exports.parseInvite = deprecate('ssb-ref.parseInvite', function (invite) {
  return (
    isLegacyInvite(invite)
      ? parseLegacyInvite(invite)
      : isMultiServerInvite(invite)
        ? parseMultiServerInvite(invite)
        : null
  )
})

exports.type =
  function (id) {
    if (!isString(id)) return false
    var c = id.charAt(0)
    if (c === '@' && isFeedId(id)) { return 'feed' } else if (c === '%' && isMsgId(id)) { return 'msg' } else if (c === '&' && isBlobId(id)) { return 'blob' } else if (isAddress(id)) return 'address'
    else if (isInvite(id)) return 'invite'
    else { return false }
  }

exports.extract =
  function (data) {
    if (!isString(data)) { return false }

    var _data = data

    var res = extractRegex.exec(_data)
    if (res) {
      return res && res[0]
    } else {
      try {
        _data = decodeURIComponent(data)
      } catch (e) {
        // this may fail if it's not encoded, so don't worry if it does
      }
      _data = _data.replace(/&amp;/g, '&')

      res = extractRegex.exec(_data)
      return res && res[0]
    }
  }

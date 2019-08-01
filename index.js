var isCanonicalBase64 = require('is-canonical-base64')
var isDomain = require('is-valid-domain')
var Querystring = require('querystring')
var ip = require('ip')

var parseLinkRegex = /^((@|%|&)[A-Za-z0-9/+]{43}=\.[\w\d]+)(\?(.+))?$/
exports.linkRegex = /^(@|%|&)[A-Za-z0-9/+]{43}=\.[\w\d]+$/
var blobIdRegex = exports.blobIdRegex = isCanonicalBase64('&', '.sha256', 32)
var msgIdRegex = exports.msgIdRegex = isCanonicalBase64('%', '.sha256', 32)

const feedTypes = ['ed25519']

exports.use = (feedType) => {
  if (typeof feedType !== 'string' || feedType.length === 0) {
    throw new Error(`Invalid feed type: "${feedType}", expected string with non-zero length`)
  }

  feedTypes.push(feedType)
}

Object.defineProperty(exports, 'feedIdRegex', {
  get: () => {
    const partialRegex = feedTypes.join('|')
    return isCanonicalBase64('@', `.(?:sha256|${partialRegex})`, 32)
  }
})

var extractRegex = /([@%&][A-Za-z0-9/+]{43}=\.[\w\d]+)/

var MultiServerAddress = require('multiserver-address')

function isMultiServerAddress (str) {
  //a http url fits into the multiserver scheme,
  //but all ssb address must have a transport and a transform
  //so check there is at least one unescaped ~ in the address
  return MultiServerAddress.check(str) && /[^!][~]/.test(str)
}

function isIP (s) {
  return ip.isV4Format(s) || ip.isV6Format(s)
}

var isInteger = Number.isInteger
var DEFAULT_PORT = 8008

function isString(s) {
  return 'string' === typeof s
}

var isHost = function (addr) {
  if(!isString(addr)) return
  addr = addr.replace(/^wss?:\/\//, '')
  return (isIP(addr)) || isDomain(addr) || addr === 'localhost'
}

var isPort = function (p) {
  return isInteger(p) && p <= 65536
}

function isObject (o) {
  return o && 'object' === typeof o && !Array.isArray(o)
}

var isFeedId = exports.isFeed = exports.isFeedId =
  function (data) {
    return isString(data) && exports.feedIdRegex.test(data)
  }

var isMsgId = exports.isMsg = exports.isMsgId =
  function (data) {
    return isString(data) && msgIdRegex.test(data)
  }

var isBlobId = exports.isBlob = exports.isBlobId =
  function (data) {
    return isString(data) && blobIdRegex.test(data)
  }

var isLink = exports.isLink =
  function (data) {
    if(!isString(data)) return false
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
      if (data.length > 0 && data.length < 30) {
        return data
      }
    }
  }

function deprecate (name, fn) {
  var logged = false
  return function () {
    var args = [].slice.call(arguments)
    if(!logged) {
      console.trace('deprecated api used: '+name)
      logged = true
    }
    return fn.apply(this, args)
  }
}

var parseMultiServerAddress = function (data) {
  if(!isString(data)) return false
  if(!MultiServerAddress.check(data)) return false

  var addr = MultiServerAddress.decode(data)
  addr = addr.find(function (address) {
    if (!address[0]) return false
    if (!address[1]) return false
    return /^(net|wss?|onion)$/.test(address[0].name) && /^shs/.test(address[1].name)
  })
  if (!Array.isArray(addr)) {
    return false
  }
  var port = +addr[0].data.pop() //last item always port, to handle ipv6

  //preserve protocol type on websocket addresses
  var host = (/^wss?$/.test(addr[0].name) ? addr[0].name+':' : '') + addr[0].data.join(':')
  var key = addr[1].data[0]
  var seed = addr[1].data[2]
  // allow multiserver addresses that are not currently understood!
  if(!(isHost(host) && isPort(+port) && isCanonicalBase64(key))) return false
  var address = {
    host: host,
    port: port,
    key: key,
  }
  if(seed)
    address.seed = seed

  return address
}

var toLegacyAddress = parseMultiServerAddress
exports.toLegacyAddress = deprecate('ssb-ref.toLegacyAddress', toLegacyAddress)

exports.isLegacyAddress = function (addr) {
  return isObject(addr) && isHost(addr.host) && isPort(addr.port) && isFeedId(addr.key)
}

var toMultiServerAddress = exports.toMultiServerAddress = function (addr) {
  if(MultiServerAddress.check(addr)) return addr
  if(!isPort(addr.port)) throw new Error('ssb-ref.toMultiServerAddress - invalid port:'+addr.port)
  if(!isHost(addr.host)) throw new Error('ssb-ref.toMultiServerAddress - invalid host:'+addr.host)
  if(!isCanonicalBase64(addr.key)) throw new Error('ssb-ref.toMultiServerAddress - invalid key:'+addr.key)

  return (
    /^wss?:/.test(addr.host)   ? addr.host
  : /\.onion$/.test(addr.host) ? 'onion:'+addr.host
  :                              'net:'+addr.host
  )+':'+addr.port+'~shs:'+addr.key
}

var isAddress = exports.isAddress = function (data) {
  let host, port, key
  if(isObject(data)) {
    key = data.key
    host = data.host
    port = data.port
  } else if(!isString(data)) {
    return false
  } else if(isMultiServerAddress(data)) {
    return true
  } else {
    const parts = data.split(':')
    key = parts.pop()
    port = parts.pop()
    host = parts.join(':')
  }
  return (
    isCanonicalBase64(key) && isPort(+port)
    && isHost(host)
  )
}

//This is somewhat fragile, because maybe non-shs protocols get added...
//it would be better to treat all addresses as opaque or have multiserver handle
//extraction of a signing key from the address.
exports.getKeyFromAddress = function (addr) {
  if(addr.key) return addr.key
  var data = MultiServerAddress.decode(addr)
  if(!data) return
  for(var k in data) {
    var address = data[k]
    for(var j in address) {
      var protocol = address[j]
      if(/^shs/.test(protocol.name)) //forwards compatible with future shs versions...
        return protocol.data[0]
    }
  }
}

var parseAddress = function (e) {
  if(isString(e)) {
    if(~e.indexOf('~'))
      return parseMultiServerAddress(e)
    var parts = e.split(':')
    var id = parts.pop(), port = parts.pop(), host = parts.join(':')
    return {
      host: host,
      port: +(port || DEFAULT_PORT),
      key: id
    }
  }
  return e
}
exports.parseAddress = deprecate('ssb-ref.parseAddress',parseAddress)

var legacyInviteRegex = /^[A-Za-z0-9/+]{43}=$/
var legacyInviteFixerRegex = /#.*$/
var isLegacyInvite = exports.isLegacyInvite =
  function (data) {
    if(!isString(data)) return false
    data = data.replace(legacyInviteFixerRegex, '')
    var parts = data.split('~')
    return parts.length == 2 && isAddress(parts[0]) && legacyInviteRegex.test(parts[1])
  }

var isMultiServerInvite = exports.isMultiServerInvite =
  function (data) {
    if (isString(data) === false) {
      return false
    }

    return Boolean(parseMultiServerInvite(data))
  }

var isInvite = exports.isInvite =
  function (data) {
    if(!isString(data)) return false
    return isLegacyInvite(data) || isMultiServerInvite(data)
  }

exports.parseLink = function parseBlob (ref) {
  var match = parseLinkRegex.exec(ref)
  if (match && match[1]) {
    if (match[3]) {
      var query = Querystring.parse(match[4])
      // unbox keys have a '+' in them that is parsed into a ' ', this changes it back
      if (isString(query.unbox)) query.unbox = query.unbox.replace(/ /g, '+')
      return {link: match[1], query }
    } else {
      return {link: match[1]}
    }
  }
}

function parseMultiServerInvite (invite) {
  const redirect = invite.split('#')

  if (redirect.length === 0) {
    return null
  }

  invite = redirect.shift()

  const addr = parseMultiServerAddress(invite)
  if(!addr) {
    return null
  }
  delete addr.seed
  return {
    invite: invite,
    remote: toMultiServerAddress(addr),
    key: addr.key,
    redirect: redirect.length ? '#' + redirect.join('#') : null
  }
}

exports.parseMultiServerInvite = deprecate('ssb-ref.parseMultiServerInvite', parseMultiServerInvite)


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

exports.extract = function (data) {
  if (!isString(data))
    return false

  var _data = data

  let res = extractRegex.exec(_data)
  if (res) {
    return res && res[0]
  } else {
    try { _data = decodeURIComponent(data) }
    catch (e) {
      // this may fail if it's not encoded, so don't worry if it does
    } 
    _data = _data.replace(/&amp;/g, '&')

    res = extractRegex.exec(_data)
    return res && res[0]
  }
}










function isString(s) {
  return 'string' === typeof s
}

exports.isLink =
  function (data) {
    return isString(data) && /^(@|%|&)[A-Za-z0-9\/+]{43}=\.[\w\d]+$/.test(data)
  }

exports.isFeedId =
  function (data) {
    return isString(data) && /^@[A-Za-z0-9\/+]{43}=\.(?:sha256|ed25519)$/.test(data)
  }

exports.isMsgId = 
  function (data) {
    return isString(data) && /^%[A-Za-z0-9\/+]{43}=\.sha256$/.test(data)
  }

exports.isBlobId = 
  function (data) {
    return isString(data) && /^&[A-Za-z0-9\/+]{43}=\.sha256$/.test(data)
  }

exports.type =
  function (data) {
    if (!exports.isLink(data))
      return false
    var c = data.charAt(0)
    if (c == '@')
      return 'feed'
    if (c == '%')
      return 'msg'
    if (c == '&')
      return 'blob'
    return false
  }

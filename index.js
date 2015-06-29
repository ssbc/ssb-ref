
function isString(s) {
  return 'string' === typeof s
}

exports = module.exports =
  function (data) {
    return isString(data) && /^[A-Za-z0-9\/+]{43}=\.[\w\d]+$/.test(data)
  }

exports.isHash =
  function (data) {
    return isString(data) && /^[A-Za-z0-9\/+]{43}=\.blake2s$/.test(data)
  }

exports.isFeedId =
  function (data) {
    return isString(data) && /^[A-Za-z0-9\/+]{43}=\.(?:blake2s|ed25519)$/.test(data)
  }

exports.isRef = exports

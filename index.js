
function isString(s) {
  return 'string' === typeof s
}

exports = module.exports =
  function (data) {
    return isString(data) && /^[A-Za-z0-9\/+]{43}=\.[\w\d]+$/.test(data)
  }

exports.isHash =
  function (data) {
    return isString(data) && /^[A-Za-z0-9\/+]{43}=\.sha256$/.test(data)
  }

exports.isFeedId =
  function (data) {
    return isString(data) && /^[A-Za-z0-9\/+]{43}=\.(?:sha256|ed25519)$/.test(data)
  }

exports.isRef = exports

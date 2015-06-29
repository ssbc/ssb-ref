# ssb-ref

check if a string is a valid ssb-reference

``` js
var ref = require('ssb-ref')

//check if a string is a tagged base64 string
ref.isRef('Lihvp+fMdt5CihjbOY6eZc0qCe0eKsrN2wfgXV2E3PM=.blake2s')
//check if a string is a hash (tagged with valid hash alg)
ref.isHash('Lihvp+fMdt5CihjbOY6eZc0qCe0eKsrN2wfgXV2E3PM=.blake2s')

//check if a string is a hash (tagged with valid hash alg)
ref.isHash('Lihvp+fMdt5CihjbOY6eZc0qCe0eKsrN2wfgXV2E3PM=.blake2s')

//check if a string is a hash (tagged with blake2s or ed25519)
ref.isFeedId('nUtgCIpqOsv6k5mnWKA4JeJVkJTd9Oz2gmv6rojQeXU=.ed25519')
```

## License

MIT

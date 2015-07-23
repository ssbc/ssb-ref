# ssb-ref

check if a string is a valid ssb-reference

``` js
var ref = require('ssb-ref')

//check if a string is a tagged base64 string
ref.isRef('@Lihvp+fMdt5CihjbOY6eZc0qCe0eKsrN2wfgXV2E3PM=.sha256')

//check if a string is a hash (tagged with valid hash alg)
ref.isHash('%Lihvp+fMdt5CihjbOY6eZc0qCe0eKsrN2wfgXV2E3PM=.sha25s')

//check if a string is a feed id
ref.isFeedId('@nUtgCIpqOsv6k5mnWKA4JeJVkJTd9Oz2gmv6rojQeXU=.ed25519')

//check if a string is a message id
ref.isMsgId('%MPB9vxHO0pvi2ve2wh6Do05ZrV7P6ZjUQ+IEYnzLfTs=.sha256')

//check if a string is a blob id
ref.isBlobId('&Pe5kTo/V/w4MToasp1IuyMrMcCkQwDOdyzbyD5fy4ac=.sha256')
```

## License

MIT

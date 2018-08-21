# ssb-ref

check if a string is a valid ssb-reference, also parses addresses

``` js
var ref = require('ssb-ref')

//check if a string is a link (sigil ++ base64, 44 chars ++ algo tag)
ref.isLink('%Lihvp+fMdt5CihjbOY6eZc0qCe0eKsrN2wfgXV2E3PM=.sha25s')

//check if a string is a feed id
ref.isFeedId('@nUtgCIpqOsv6k5mnWKA4JeJVkJTd9Oz2gmv6rojQeXU=.ed25519')

//check if a string is a message id
ref.isMsgId('%MPB9vxHO0pvi2ve2wh6Do05ZrV7P6ZjUQ+IEYnzLfTs=.sha256')

//check if a string is a blob id
ref.isBlobId('&Pe5kTo/V/w4MToasp1IuyMrMcCkQwDOdyzbyD5fy4ac=.sha256')

//get the type of the reference
ref.type('@nUtgCIpqOsv6k5mnWKA4JeJVkJTd9Oz2gmv6rojQeXU=.ed25519') == 'feed'
ref.type('%MPB9vxHO0pvi2ve2wh6Do05ZrV7P6ZjUQ+IEYnzLfTs=.sha256')  == 'msg'
ref.type('&Pe5kTo/V/w4MToasp1IuyMrMcCkQwDOdyzbyD5fy4ac=.sha256')  == 'blob'
ref.type('not-a-link') == false

//extract a ref out of a url
ref.extract('http://localhost:7777/#/msg/%pGzeEydYdHjKW1iIchR0Yumydsr3QSp8+FuYcwVwi8Q=.sha256?foo=bar')
 == '%pGzeEydYdHjKW1iIchR0Yumydsr3QSp8+FuYcwVwi8Q=.sha256'
//url-encoding is supported
ref.extract('http://localhost:7777/#/msg/%25pGzeEydYdHjKW1iIchR0Yumydsr3QSp8%2BFuYcwVwi8Q%3D.sha256?foo=bar')
 == '%pGzeEydYdHjKW1iIchR0Yumydsr3QSp8+FuYcwVwi8Q=.sha256'

// check if a ref is a valid address
ref.isAddress('net:[fe80::1488:a895:bee0:d1b4%en0]:8008~shs:FCX/tsDLpubCPKKfIrw4gc+SQkHcaD17s7GI6i/ziWY=') == false

// parse the port, host and key from an adress
ref.parseAddress('net:192.168.8.9:8008~shs:FCX/tsDLpubCPKKfIrw4gc+SQkHcaD17s7GI6i/ziWY=')
  { host: '192.168.8.9',
    port: 8008,
    key: '@FCX/tsDLpubCPKKfIrw4gc+SQkHcaD17s7GI6i/ziWY=.ed25519' }
```

## License

MIT

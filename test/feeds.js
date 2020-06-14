var tape = require('tape')
var R = require('../')

var feedRef = '@jEA8WSl0URsB/g/XYG5zCGBkMOyTeBZfGtbw3RJMIuk=.ed25519'

var feedUrls = [
  'http://localhost:7777/#/profile/%40jEA8WSl0URsB%2Fg%2FXYG5zCGBkMOyTeBZfGtbw3RJMIuk%3D.ed25519',
  'http://localhost:7777/#/profile/@jEA8WSl0URsB/g/XYG5zCGBkMOyTeBZfGtbw3RJMIuk=.ed25519',
  'http://localhost:7777/%40jEA8WSl0URsB%2Fg%2FXYG5zCGBkMOyTeBZfGtbw3RJMIuk%3D.ed25519',
  'http://localhost:7777/@jEA8WSl0URsB/g/XYG5zCGBkMOyTeBZfGtbw3RJMIuk=.ed25519',
  'http://localhost:7777/%40jEA8WSl0URsB%2Fg%2FXYG5zCGBkMOyTeBZfGtbw3RJMIuk%3D.ed25519?foo=bar',
  'http://localhost:7777/@jEA8WSl0URsB/g/XYG5zCGBkMOyTeBZfGtbw3RJMIuk=.ed25519?foo=bar'
]

tape('extract (feed)', function (t) {
  feedUrls.forEach(function (url) {
    t.equal(R.extract(url), feedRef)
  })
  t.end()
})

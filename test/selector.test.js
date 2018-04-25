var test = require('tape')
var yo = require('yo-yo')
var renderSelector = require('../lib/selector')

var overlaysFixture = [{
  index: 0,
  name: 'activeOverlay',
  ids: ['layer1', 'layer2']
}, {
  index: 1,
  name: 'indeterminateOverlay',
  ids: ['layer2', 'layer3']
}, {
  index: 2,
  name: 'inactiveOverlay',
  ids: ['layer3']
}]

var underlaysFixture = [{
  index: 0,
  name: 'underlay1',
  ids: ['layer5']
}, {
  index: 1,
  name: 'underlay2',
  ids: ['layer6']
}]

var overlaysStateFixture = ['active', 'indeterminate', 'inactive']

test('render selector', function (t) {
  var underlayState = 'indeterminate'
  var selector = renderSelector({
    overlays: overlaysFixture,
    underlays: underlaysFixture,
    overlaysState: overlaysStateFixture,
    underlayState: underlayState
  })
  console.log(selector.toString())
  t.end()
})

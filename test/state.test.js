var test = require('tape')

var state = require('../lib/state')

var mapStateFixture = {
  'visible1': 'visible',
  'visible2': 'visible',
  'visible3': 'visible',
  'hidden1': 'none',
  'hidden2': 'none'
}

var mapMock = {
  getLayoutProperty: function (id) {
    return mapStateFixture[id]
  }
}

test('getOverlaysState', function (t) {
  var overlaysState = state.getOverlaysState(mapMock, [{
    name: 'overlay1',
    ids: ['visible1']
  }, {
    name: 'overlay2',
    ids: ['visible2', 'hidden1']
  }, {
    name: 'overlay3',
    ids: ['hidden2']
  }])

  var expectedState = [
    'active',
    'indeterminate',
    'inactive'
  ]

  t.deepEqual(overlaysState, expectedState)
  t.end()
})

test('getUnderlayState all visible', function (t) {
  var underlaysState = state.getUnderlayState(mapMock, [{
    name: 'underlay1',
    ids: ['visible1']
  }, {
    name: 'underlay2',
    ids: ['visible2']
  }])

  t.equal(underlaysState, 'indeterminate')
  t.end()
})

test('getUnderlayState none visible', function (t) {
  var underlaysState = state.getUnderlayState(mapMock, [{
    name: 'underlay1',
    ids: ['hidden1']
  }, {
    name: 'underlay2',
    ids: ['hidden2']
  }])

  t.equal(underlaysState, 'none')
  t.end()
})

test('getUnderlayState mixed', function (t) {
  var underlaysState = state.getUnderlayState(mapMock, [{
    name: 'underlay1',
    ids: ['visible1']
  }, {
    name: 'underlay2',
    ids: ['visible2', 'hidden1']
  }])

  t.equal(underlaysState, 'indeterminate')
  t.end()
})

test('getUnderlayState one visible', function (t) {
  var underlaysState = state.getUnderlayState(mapMock, [{
    name: 'underlay1',
    ids: ['hidden1']
  }, {
    name: 'underlay2',
    ids: ['hidden2']
  }, {
    name: 'underlay3',
    ids: ['visible1']
  }])

  t.equal(underlaysState, 2)
  t.end()
})

test('getUnderlayState one visible v2', function (t) {
  var underlaysState = state.getUnderlayState(mapMock, [{
    name: 'underlay1',
    ids: ['visible1', 'visible2']
  }, {
    name: 'underlay2',
    ids: ['hidden1']
  }])

  t.equal(underlaysState, 0)
  t.end()
})

test('getUnderlayState one visible v3', function (t) {
  var underlaysState = state.getUnderlayState(mapMock, [{
    name: 'underlay1',
    ids: ['visible2']
  }, {
    name: 'underlay2',
    ids: ['hidden1', 'hidden2']
  }])

  t.equal(underlaysState, 0)
  t.end()
})

test('getUnderlayState two visible', function (t) {
  var underlaysState = state.getUnderlayState(mapMock, [{
    name: 'underlay1',
    ids: ['visible1']
  }, {
    name: 'underlay2',
    ids: ['hidden1']
  }, {
    name: 'underlay3',
    ids: ['visible2']
  }])

  t.equal(underlaysState, 'indeterminate')
  t.end()
})

test('getUnderlayState mixed', function (t) {
  var underlaysState = state.getUnderlayState(mapMock, [{
    name: 'underlay1',
    ids: ['visible1']
  }, {
    name: 'underlay2',
    ids: ['hidden1']
  }, {
    name: 'underlay3',
    ids: ['visible2', 'hidden2']
  }])

  t.equal(underlaysState, 'indeterminate')
  t.end()
})

test('getUnderlayState repeat', function (t) {
  var underlaysState = state.getUnderlayState(mapMock, [{
    name: 'underlay1',
    ids: ['visible1']
  }, {
    name: 'underlay2',
    ids: ['hidden1']
  }, {
    name: 'underlay3',
    ids: ['visible1']
  }])

  t.equal(underlaysState, 'indeterminate')
  t.end()
})

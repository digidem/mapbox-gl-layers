var state = require('./lib/state')
var renderSelector = require('./lib/selector')

module.exports = Layers

var defaultOptions = {
  position: 'top-right'
}

/**
 * Creates a layer toggle control
 * @param {Object} [options]
 * @param {Object} [options.backgrounds] Array of background layers (select one)
 * @param {Object} [options.overlays] Array of overlay layers (select multiple)
 * @param {string} [options.position='top-right'] A string indicating position on the map. Options are `top-right`, `top-left`, `bottom-right`, `bottom-left`.
 * @example
 * (new Layers({ 'National Parks': 'national_park', 'Other Parks': 'parks' }))
 * .addTo(map)
 */
function Layers (overlays, underlays, options) {
  this.options = Object.assign({}, defaultOptions, options)
  this.overlays = (overlays || []).map(addIndexMap)
  this.underlays = (underlays || []).map(addIndexMap)

  this.overlayLayerIds = this.overlays.reduce(layerIdReduce, [])
  this.underlayLayerIds = this.underlays.reduce(layerIdReduce, [])

  this._onClickOverlay = this._onClickOverlay.bind(this)
  this._onClickUnderlay = this._onClickUnderlay.bind(this)
  this._update = this._update.bind(this)
}

Layers.prototype.onAdd = function onAdd (map) {
  this._map = map
  var style = map.getStyle()
  this._allLayersInMap = style.layers.map((layer) => layer.id)
  this._map.on('style.change', this._update)
  this._map.style.on('layer.remove', this._update)
  this._map.style.on('layer.add', this._update)
  this._container = this._render()
  return this._container
}

Layers.prototype.onRemove = function onRemove () {
  this._map.off('style.change', this._update)
  this._map.style.off('layer.remove', this._update)
  this._map.style.off('layer.add', this._update)
  this._map = null
  this._container = null
}

Layers.prototype._update = function _update () {
  this._allLayersInMap = this._map.getStyle().layers.map((layer) => layer.id)
  var parent = this._container.parentNode
  var newContainer = this._render()
  parent.replaceChild(newContainer, this._container)
  this._container = newContainer
}

Layers.prototype._render = function _render () {
  return renderSelector({
    overlaysState: state.getOverlaysState(this._map, this.overlays),
    underlayState: state.getUnderlayState(this._map, this.underlays),
    overlays: this.overlays.filter(hasLayers(this._allLayersInMap)),
    underlays: this.underlays.filter(hasLayers(this._allLayersInMap)),
    onClickOverlay: this._onClickOverlay,
    onClickUnderlay: this._onClickUnderlay
  })
}

Layers.prototype._onClickOverlay = function _onClickOverlay (e) {
  var map = this._map
  var overlay = this.overlays[+e.currentTarget.getAttribute('value')]
  var isChecked = e.currentTarget.checked
  overlay.ids.forEach(function (id) {
    if (!map.getLayer(id)) return
    if (isChecked) map.setLayoutProperty(id, 'visibility', 'visible')
    else map.setLayoutProperty(id, 'visibility', 'none')
  })
  this._update()
}

Layers.prototype._onClickUnderlay = function _onClickUnderlay (e) {
  var underlay = this.underlays[+e.currentTarget.getAttribute('value')]

}

function layerIdReduce (acc, layer) {
  return layer.ids.concat(acc)
}

function addIndexMap (layer, i) {
  return Object.assign({}, layer, {
    index: i
  })
}

function hasLayers (layersInMap) {
  return function (layer) {
    return layer.ids.some(function (id) {
      return layersInMap.indexOf(id) > -1
    })
  }
}

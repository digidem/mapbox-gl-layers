var html = require('nanohtml')
var css = require('sheetify')

var state = require('./lib/state')
var renderSelector = require('./lib/selector')
var renderButton = require('./lib/icon_button')

var prefix = css`
  :host {
    position: relative;
  }
  :host > .layer-chooser {
    top: 0;
    position: absolute;
    right: 30px;
    min-width: 150px;
  }
`

module.exports = Layers

var defaultOptions = {
  onChange: function () {}
}

/**
 * Creates a layer toggle control
 * @param {Object} [options]
 * @param {Object} [options.underlays] Array of background layers (select one)
 * @param {Object} [options.overlays] Array of overlay layers (select multiple)
 * @param {Function} [options.onChange] Function called when layer selections are changed
 * @example
 * (map.addControl(new Layers({overlays: { 'National Parks': 'national_park', 'Other Parks': 'parks' })}))
 */
function Layers (options) {
  this.options = Object.assign({}, defaultOptions, options)
  this.overlays = (this.options.overlays || []).map(addIndexMap)
  this.underlays = (this.options.underlays || []).map(addIndexMap)

  this.overlayLayerIds = this.overlays.reduce(layerIdReduce, [])
  this.underlayLayerIds = this.underlays.reduce(layerIdReduce, [])

  this._onChange = this.options.onChange
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

Layers.prototype.getDefaultPosition = function () {
  return this.options.position
}

Layers.prototype._update = function _update () {
  this._allLayersInMap = this._map.getStyle().layers.map((layer) => layer.id)
  // We do this because we use `indeterminate` checkboxes and nanomorph and
  // morphdom do not know how to diff these. Performance is fine.
  var parent = this._container.parentNode
  var newContainer = this._render()
  parent.replaceChild(newContainer, this._container)
  this._container = newContainer
}

Layers.prototype._render = function _render () {
  var layerSelector = renderSelector({
    overlaysState: state.getOverlaysState(this._map, this.overlays),
    underlayState: state.getUnderlayState(this._map, this.underlays),
    overlays: this.overlays.filter(hasLayers(this._allLayersInMap)),
    underlays: this.underlays.filter(hasLayers(this._allLayersInMap)),
    onClickOverlay: this._onClickOverlay,
    onClickUnderlay: this._onClickUnderlay
  })
  var layerButton = renderButton()
  return html`
    <div class="mapboxgl-ctrl ${prefix}">
      <div class="mapboxgl-ctrl-group">
        ${layerButton}
      </div>
      <div class="layer-chooser">
        ${layerSelector}
      </div>
    </div>
  `
}

Layers.prototype._onClickOverlay = function _onClickOverlay (e) {
  var map = this._map
  var overlay = this.overlays[+e.currentTarget.getAttribute('value')]
  var isChecked = e.currentTarget.checked
  overlay.ids.forEach(function (id) {
    if (isChecked) setLayerVisibility(map, id, 'visible')
    else setLayerVisibility(map, id, 'none')
  })
  this._update()
}

Layers.prototype._onClickUnderlay = function _onClickUnderlay (e) {
  var map = this._map
  var idsToHide = this.underlayLayerIds
  var idsToShow = []
  var underlayId = e.currentTarget.getAttribute('value')
  if (underlayId !== 'none') {
    idsToShow = this.underlays[+underlayId].ids
    idsToHide = this.underlayLayerIds.filter(id => !idsToShow.includes(id))
  }
  idsToHide.forEach(function (id) {
    setLayerVisibility(map, id, 'none')
  })
  idsToShow.forEach(function (id) {
    setLayerVisibility(map, id, 'visible')
  })
  this._update()
}

function setLayerVisibility (map, layerId, visibility) {
  if (!map.getLayer(layerId)) return
  var current = map.getLayoutProperty(layerId, 'visibility')
  if (current === visibility) return
  map.setLayoutProperty(layerId, 'visibility', visibility)
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

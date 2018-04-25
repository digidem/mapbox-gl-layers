module.exports = {
  getOverlaysState: getOverlaysState,
  getUnderlayState: getUnderlayState
}

/**
 * For each layer in an overlay:
 * - if all the layer ids are visible, set state to active
 * - if all layer ids are not visible, set start to inactive
 * - if some are visible and others not, set to indeterminate
 * @param {mapboxgl.Map} map instance of a mapboxgl Map
 * @param {array} overlays an array of layer objects with a property 'ids' (array)
 * @returns {array} array of states of each layer
 */
function getOverlaysState (map, overlays) {
  var overlayState = new Array(overlays.length)
  overlays.forEach(function (layer, i) {
    layer.ids.forEach(function (id) {
      var isVisible = map.getLayoutProperty(id, 'visibility') === 'visible'
      if (!overlayState[i]) {
        overlayState[i] = isVisible ? 'active' : 'inactive'
      } else if (isVisible && overlayState[i] === 'inactive') {
        overlayState[i] = 'indeterminate'
      } else if (!isVisible && overlayState[i] === 'active') {
        overlayState[i] = 'indeterminate'
      }
    })
  })
  return overlayState
}

/**
 * Underlays are 'select one' i.e. only one can be selected at a time. However,
 * the map may initially have more than one layer visible, in which case the state
 * of the entire underlay section will be 'indeterminate'
 * @param {*} map
 * @param {*} underlays
 */
function getUnderlayState (map, underlays) {
  var underlayState
  underlays.forEach(function (layer, i) {
    if (underlayState === 'indeterminate') return
    var layerVisibility
    layer.ids.forEach(function (id) {
      var isVisible = map.getLayoutProperty(id, 'visibility') === 'visible'
      if (typeof layerVisibility === 'undefined') {
        layerVisibility = isVisible ? 'visible' : 'hidden'
      } else if (isVisible && layerVisibility === 'hidden') {
        layerVisibility = 'indeterminate'
      } else if (!isVisible && layerVisibility === 'visible') {
        layerVisibility = 'indeterminate'
      }
    })
    if (layerVisibility === 'hidden') return
    if (layerVisibility === 'indeterminate') {
      underlayState = 'indeterminate'
    } else if (layerVisibility === 'visible') {
      if (typeof underlayState === 'undefined') {
        underlayState = i
      } else {
        underlayState = 'indeterminate'
      }
    }
  })
  if (typeof underlayState === 'undefined') {
    underlayState = 'none'
  }
  return underlayState
}

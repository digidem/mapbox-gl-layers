var mapboxgl = require('mapbox-gl')
var css = require('sheetify')

var MapboxGLLayers = require('./')

mapboxgl.accessToken = 'pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg'

const bingSource = {
  type: 'raster',
  tiles: [
    'https://ecn.t0.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=5869',
    'https://ecn.t1.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=5869',
    'https://ecn.t2.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=5869',
    'https://ecn.t3.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=5869'
  ],
  minzoom: 1,
  maxzoom: 21,
  tileSize: 256
}

const bing = {
  id: 'bing',
  type: 'raster',
  source: 'bing',
  layout: {
    visibility: 'none'
  },
  paint: {
  }
}

var mapDiv = document.createElement('div')
document.body.appendChild(mapDiv)

var map = window.map = new mapboxgl.Map({
  container: mapDiv,
  style: 'mapbox://styles/mapbox/satellite-streets-v9'
})

map.on('style.load', function () {
  map.addSource('bing', bingSource)
  map.addLayer(bing, 'mapbox-mapbox-satellite')

  var overlayIds = map.getStyle().layers.reduce((acc, layer) => {
    if (layer.type !== 'raster' && layer.type !== 'background') acc.push(layer.id)
    return acc
  }, [])

  var layersControl = new MapboxGLLayers([{
    name: 'Streets',
    ids: overlayIds
  }], [{
    name: 'Mapbox Satellite',
    ids: ['mapbox-mapbox-satellite']
  }, {
    name: 'Bing Satellite',
    ids: ['bing']
  }])

  map.addControl(layersControl)
})

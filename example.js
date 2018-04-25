var mapboxgl = require('mapbox-gl')
var css = require('sheetify')

var MapboxGLLayers = require('./')

mapboxgl.accessToken = 'pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg'

var mapDiv = document.createElement('div')
document.body.appendChild(mapDiv)

var map = window.map = new mapboxgl.Map({
  container: mapDiv,
  style: 'mapbox://styles/mapbox/streets-v9'
})

map.on('style.load', function () {
  // defaults to using all layers in the style, grouped as they are
  // in Mapbox Studio
  // new MapboxGLLayers({position: 'top-left'}).addTo(map);

  var layersControl = new MapboxGLLayers([{
    name: 'ALL PARKS',
    ids: ['national_park', 'park']
  }, {
    name: 'National Parks',
    ids: ['national_park']
  }, {
    name: 'Other parks',
    ids: ['park']
  }])

  map.addControl(layersControl)
})

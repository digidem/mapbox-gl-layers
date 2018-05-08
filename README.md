[![Circle CI](https://circleci.com/gh/developmentseed/mapbox-gl-layers.svg?style=svg)](https://circleci.com/gh/developmentseed/mapbox-gl-layers)

# mapbox-gl-layers

Layer toggle for [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/)

## Install

`npm install mapbox-gl-layers`

(Note the peer dependency on `mapbox-gl`!)

## Use

### CommonJS

```js
var Layers = require('mapbox-gl-layers')
var overlays = [{
  name: 'Streets',
  ids: overlayIds
}]
var underlays = [{
  name: 'Mapbox Satellite',
  ids: ['mapbox-mapbox-satellite']
}, {
  name: 'Bing Satellite',
  ids: ['bing']
}]
map.addControl(new Layers({overlays, underlays})) // map is the mapbox gl map instance
```

### Standalone script

Add to `<head>`:

```html
<script src='dist/mapbox-gl-layers.js'></script>
```

## API

### Layers

Creates a layer toggle control

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** 
    -   `options.type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Selection type: `multiple` to allow independently toggling each layer/group, `single` to only choose one at a time. (optional, default `'multiple'`)
    -   `options.underlays, options.overlays` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** An object determining which layers to include.  Each key is a display name (what's shown in the UI), and each value is the corresponding layer id in the map style (or an array of layer ids).
    -   `options.onChange` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)=** Optional callback called with `{name: dispayName, layerIds: [...], active: true|false }` for the clicked layer

## Contributing

This is an [OPEN open source](http://openopensource.org/) project.
Contributions are welcome!

Steps:

1.  Clone the repo and run `npm install`.
2.  Start test server with `npm start`, open <http://localhost:9966/example.html>,
    and start make changes to `index.js` and friends.

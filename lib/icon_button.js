var html = require('nanohtml')
var fs = require('fs')
var path = require('path')
var css = require('sheetify')

var svg = fs.readFileSync(path.join(__dirname, '../node_modules/material-design-icons/maps/svg/production/ic_layers_24px.svg'), 'utf-8')
var dataURI = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svg)

var prefix = css`
  :host {
    background-repeat: no-repeat;
    background-position: center;
  }
`

module.exports = function iconButton ({onClick} = {}) {
  return html`
    <button
      style="background-image: url(${dataURI});"
      class="mapboxgl-ctrl-icon ${prefix}"
      type="button"
      aria-label="Show Layer Chooser">
    </button>
  `
}

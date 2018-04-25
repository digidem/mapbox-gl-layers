var html = require('nanohtml')
var css = require('sheetify')

var prefix = css`
  :host {
    background-color: white;
    position: relative;
    pointer-events: all;
  }
`

const renderSelector = ({
  overlaysState,
  underlayState,
  overlays,
  underlays,
  onClickOverlay,
  onClickUnderlay
}) => html`
  <form class=${prefix}>
    <fieldset>
      ${overlayCheckboxes(overlays, overlaysState, onClickOverlay)}
    </fieldset>
    <fieldset>
      ${underlayRadios(underlays, underlayState, onClickUnderlay)}
    </fieldset>
  </form>
`

function overlayCheckboxes (overlays, overlaysState, onClick) {
  return overlays
    .map(function (layer) {
      var i = layer.index
      var checked = overlaysState[i] !== 'inactive'
      var indeterminate = overlaysState[i] === 'indeterminate'
      return html`<div>
        <input
          onclick=${onClick}
          type="checkbox"
          checked=${checked}
          indeterminate=${indeterminate}
          name="overlay"
          value="${i}"
          id="layer-${i}">
        <label for="layer-${i}">${layer.name}</label>
      </div>`
    })
}

function underlayRadios (underlays, underlayState, onClick) {
  var noneOption = html`<div>
    <input
      onclick=${onClick}
      type="radio"
      checked=${underlayState === 'none'}
      name="underlay"
      value="none"
      id="none">
    <label for="none">None</label>
  </div>`
  return [noneOption].concat(underlays
    .map(function (layer) {
      var i = layer.index
      var checked = underlayState === i
      return html`<div>
        <input
          onclick=${onClick}
          type="radio"
          checked=${checked}
          name="underlay"
          value="${i}"
          id="layer-${i}">
        <label for="layer-${i}">${layer.name}</label>
      </div>`
    }))
}

module.exports = renderSelector

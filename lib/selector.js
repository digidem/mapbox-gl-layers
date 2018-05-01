var html = require('nanohtml')

const renderSelector = ({
  overlaysState,
  underlayState,
  overlays,
  underlays,
  onClickOverlay,
  onClickUnderlay
}) => html`
  <form>
      ${overlayCheckboxes(overlays, overlaysState, onClickOverlay)}
      ${underlayRadios(underlays, underlayState, onClickUnderlay)}
  </form>
`

function overlayCheckboxes (overlays, overlaysState, onClick) {
  if (!overlays.length) return
  return html`<div>
    ${overlays
      .map(function (layer) {
        var i = layer.index
        var checked = overlaysState[i] !== 'inactive'
        var indeterminate = overlaysState[i] === 'indeterminate'
        return html`<fieldset>
          <input
            onclick=${onClick}
            type="checkbox"
            checked=${checked}
            indeterminate=${indeterminate}
            name="overlay"
            value="${i}"
            id="layer-${i}">
          <label for="layer-${i}">${layer.name}</label>
        </fieldset>`
      })
    }
  </div>`
}

function underlayRadios (underlays, underlayState, onClick) {
  if (!underlays.length) return
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
  return html`<fieldset>
    ${[noneOption].concat(underlays
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
    }</fieldset>`
}

module.exports = renderSelector

# Electrum API

Components using Electrum can rely on the following API.

### Identifying components

Every component should have a unique `id` property within a given view. The
`id` is used to bind the component with the store, but also to retrieve its
ressources.

### Resources

Resources store texts and are used for localization.

A component instance `obj` can get its associated text with any of the
following functions:

* `E.getText (obj)` &rarr; main text for the given `obj`.
* `E.getText (obj, what)` &rarr; specific text for the given `obj`. The `what`
  specifier should be used if a component requires multiple texts.

### Values

Values represent the data manipulated or displayed by a component.

* `E.getValue (obj)` &rarr; value bound to this `obj`.
* `E.setValue (obj, value)` &rarr; generation id after the update.

The `value` can either be a `string` (as would be the case for a simple
`<TextField>` component), a number, an array or an object. Boolean values
should be avoided in favor of strings (a `<Checkbox>` would specify its
value as being `'on'` or `'off'`, rather than `true` or `false`).

### States

States represent additional information related to the component. They
do not alter the value, but might be required to restore a piece of UI
in an exact same configuration.

A text field might want to store the position of the cursor or its
selection range as a state.

A component might want to store the fact that it is disabled as a state.

* `E.getState (obj, pattern)` &rarr; state matching the `pattern`.
* `E.setState (obj, state)` &rarr; generation id after the update.
* `E.clearState (obj, pattern)` &rarr; generation id after the update.

The `state` object contains one or multiple properties.

The `pattern` is used to pick a given state object in the states associated
with a component. The pattern is the concatenation of the property keys:

```js
var selectionState = {
  from: 3,
  to: 21
}

// The pattern for the selectionState would be:
var pattern = 'from,to';
```

Setting a state does only add or replace the state object which matches
the pattern.

### Styles

Styles provide styling information which is compatible with Radium.

> _I am not sure yet if this belongs into the Electrum API or if this
> can be surfaced simply through the theming globals._

### Bus

The bus defines how the components can send messages to the backend.

* `E.bus.dispatch (obj, message)` dispatches a message.

Currently, components can use the `E.bus.dispatch` method to send
action messages to the backend.

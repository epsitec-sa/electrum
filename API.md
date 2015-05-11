# Electrum API

Components using Electrum can rely on the following API.

## Requirements

### Identifying components

Every component should have a unique `id` property within a given view. The
`id` is used to bind the component with the store, but also to retrieve its
ressources.

### Providing a data store

Electrum does not provide any storage mechanism. It will have to be provided
when configuring `E`.

#### Lydia and the store

Lydia, for instance, provides a _flux_-like system which is teared between
the viewer layer and the presentation layer. The logic is implemented in the
presentation layer, which is written on top of .NET. The viewer only has a
**passive store** which gets updated asynchronously by _pushes_ coming from
the presentation layer.

Having the store reference in the presentation layer introduces a latency
issue. We don't want to lock the UI while messages are being sent to the
presentation layer, processed, and values sent back to the viewer's store.
However, refreshing the UI before the store has been updated won't display
the most recent user input.

Therefore, we need to let the viewer temporarily update its store, while
waiting for the _real_ values to be provided by the presentation layer.

Imagine following sequence of events:

1. The user types `a` into an empty text field.
2. The local store for the text field gets updated to `'a'`.
3. The update gets sent to the presentation layer.
4. The user types `b`.
5. The local store gets updated to `'ab'`.
6. The update gets sent to the presentation layer.
7. The first value comes back from the presentation layer: `'A'`.
8. The user types `c`.
9. The second value comes back from the presentaiton layer: `'AB'`.
10. Etc.

The problem appears after point 7: the field no longer contains `'ab'`,
but `'A'`, and so the user's input gets mangled to `'Ac'`. Moreover, a
little bit later, the value gets wiped out and replace with `'AB'`...

We solved this issue in Lydia by attaching a _generation number_ to
every value which gets modified (point 2 would produce `#1`, point
5 would produce `#2`). The generation number gets sent back and forth
between the viewer and the presentation layer, thus allowing the store
to notice at point 7 that the value should be discarded (remember, at
this stage, the local store is at generation `#2` but the first value
is attached to generation `#1`).

#### Other store implementations

Other store implementations would simply be built on top of _reflux_
or some similar library. As long as the store can communicate with
Electrum's API, _all will be well_.

## API

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

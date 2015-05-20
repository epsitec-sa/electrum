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
   &rArr; _we have our first problem_
8. The user types `c`.
9. The second value comes back from the presentation layer: `'AB'`.
   &rArr; _things get even worse_
10. etc.

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
* `E.setValue (obj, value, ...states)` &rarr; generation id after update.

The `value` can either be a `string` (as would be the case for a simple
`<TextField>` component), a number, an array or an object. Boolean values
should be avoided in favor of strings (a `<Checkbox>` would specify its
value as being `'on'` or `'off'`, rather than `true` or `false`).

`E.setValue` can specify zero, one or multiple states which should be
set at the same time as the value.

The **generation id** will only be incremented if changes were detected.
Otherwise, the generation id of the last modification will be returned.

### States

States represent additional information related to the component. They
do not alter the value, but might be required to restore a piece of UI
in an exact same configuration.

A text field might want to store the position of the cursor or its
selection range as a state.

A component might want to store the fact that it is disabled as a state.

* `E.getState (obj, pattern)` &rarr; state matching the `pattern`.
* `E.setState (obj, ...states)` &rarr; generation id after the update.
* `E.clearState (obj, pattern)` &rarr; generation id after the update.

The `state` object contains one or multiple properties.

The `pattern` is used to pick a given state object in the states associated
with a component. The pattern is the concatenation of the property keys:

```js
var selectionState = {
  from: 3,
  to: 21
};

// The pattern for the selectionState would be:
var pattern = 'from,to';
```

Setting a state does only add or replace the state object which matches
the pattern.

### Generations

The last generation id is automatically associated with the component.
It is maintained internally using a generation state object:

```js
var generationState = {
  gen: 1
};
```

Whenever you set a new value or a new state, this generation state object
gets updated, as if `E.setState (obj, {gen: n})` were called.

### Styles

Styles provide styling information which is compatible with Radium.

* `E.getStyle (obj, ...styles)` &rarr; array of styles

The function expects that the object provides several properties:

* `obj.theme` (optional) &rarr; a dictionary with multiple styles; each
  style can be accessed through a key.
* `obj.props.kind` (optional) &rarr; one or many selectors which will
  be used to retrieve styles from `obj.theme`.
* `obj.props.style` (optional) &rarr; one or many styles provided by
  the user of the component; they take precedence over the styles
  provided in the call to `E.getStyle`.

Let's imagine that we have this theme injected into every `<Button>`
component (available as `obj.theme`):

```js
var buttonTheme = {
  base:   { /* ... */ },
  accept: { /* ... */ },
  cancel: { /* ... */ }
};
```

In the view, we use the `<Button>` and set its `kind` property in order
to select the appropriate style from the `buttonTheme`. In the context
of the view, the local theme defines a style named `pepper`.

```jsx
<Button kind="accept" style={['pepper', {color: 'red'}]} />
```

This will merge following styles, in sequence:

* `buttonTheme.base` &rarr; default style applied to the component.
* `buttonTheme.accept` &rarr; specific style (selected by `kind` property).
* `context.localTheme.pepper` &rarr; local style taken in the view's context.
* `{color: 'red'}` &rarr; manual style forced onto the component.

> _For now, we do not yet support the local style taken from the view's
> context, as this has not yet stabilized enough in Lydia_

### Bus

The [bus](Bus.md) defines a communication channel for the components to
send messages to the backend. It has its [own documentation](Bus.md).


## Implementation details

Whenever the data is altered by calling `setValue` or `setState`/`clearState`,
the implementation should call `E.bus.notify` in order to propagate the
fact that something happened to the component.

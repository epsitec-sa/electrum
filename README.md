# Electrum

[![NPM version](https://img.shields.io/npm/v/electrum.svg)](https://www.npmjs.com/package/electrum)
[![Build Status](https://travis-ci.org/epsitec-sa/electrum.svg?branch=master)](https://travis-ci.org/epsitec-sa/electrum)
[![Build status](https://ci.appveyor.com/api/projects/status/rik5ss091uvmcewh?svg=true)](https://ci.appveyor.com/project/epsitec/electrum)

**Electrum** simplifies framework-agnostic declaration of React components.
It is used internally by [Epsitec SA](https://github.com/epsitec-sa/) to
bridge the gap with its _Xcraft toolchain_ and with its _Lydia framework_.

## Where does the name Electrum come from?

[_Electrum_](http://en.wikipedia.org/wiki/Electrum) is an alloy of gold and
silver used to produce ancient [Lydian](http://en.wikipedia.org/wiki/Lydia)
coinage.

> The first metal coins ever made, were of Electrum and date back to the end
> of the 7th century, beginning of the 6th century BC.

# THIS IS WORK IN PROGRESS

The implementation of `electrum` is being modified radically.  
**Please wait until version has stabilized**.

# Linking components with their state

Let's say we want to display an **article** which contains the **content**
and information about the **author**. The article data might be represented
like this:

```json
{ "article":
  { "content":
    { "title": "About typography"
    , "text": "Lorem ipsum..."
    , "date": "2015-12-02" }
  , "author":
    { "name": "John"
    , "mail": "john@doe.org" } } }
```

This can be loaded into a `store` instance. The `"article"` node will be
passed as _state_ to the `<Article>` component:

```javascript
// In this example, the article is the root component
const state = store.select ('article');
return <Article state={state}/>;
```

The `<Article>` can be implemented as a _stateless function component_:

```javascript
import E from 'electrum';
function Article (props) {
  return (
    <div>
      <Content {...E.link (props, 'content')} />
      <Author {...E.link (props, 'author')} />
    </div>
  );
}
```

# Reading state

Components will very often need to read values from the store. To make life
easier for the developer, `electrum` provides a `read()` method, which takes
the `props` of the component and an optional `key` of the value to read:

```javascript
import E from 'electrum';
function Content (props) {
  return (
    <div>
      <h1>{E.read (props)}</h1>
      <p>{E.read (props, 'details')}</p>
    </div>
  );
}
```

# Managing styles with Radium

We decided to use `radium` as the way to go to inject styles into components.
By using the `E` instance provided by `import Electrum from 'electrum'`),
components are automatically configured to use `radium` when _wrapped_ like
this:

```javascript
import Electrum from 'electrum';
import _Button from './Button.component.js';
import _Button$styles from './Button.styles.js';
export const Button = Electrum.wrap ('Button', _Button, {styles: _Button$styles});
```

# Wrapping and automatic component extensions

`Electrum.wrap()` returns a new component `class`, which will be treated as a
**pure component** by React:

* `shouldComponentUpdate(nextProps, nextState)` &rarr; pure component.  
  The test is based on a _shallow comparison_ of the properties and of the state
  (if any).

It injects some additional functionality:

* `link(id)` &rarr; shorthand for `Electrum.link(this.props, id)`.
* `read(key)` &rarr; shorthand for `Electrum.read(this.props, key)`.
* `theme` &rarr; shorthand for `this.props.theme`.
* `styles` &rarr; resolves the _styles_ based on rules implemented by `Style`.

The component is also extended by [Radium](https://github.com/FormidableLabs/radium)
which will flatten `styles` arrays injected in child components, and handle the
state required to handle browser states such as `:hover`.

One more trick `Electrum.wrap()` does is that it ensures that event handler
methods (e.g. `onChange` or `handleFoo`) get properly bound to the component
instance. Therefore, event handlers can be passed to `React` in a natural
way:

```javascript
render () {
  return <div onClick={this.onClick}>Click me</div>;
}
```

whereas normally, you would have to write this:

```javascript
render () {
  return <div onClick={this.onClick.bind (this)}>Click me</div>;
}
```

or do the binding manually in the constructor:

```javascript
constructor () {
  super ();
  this.onClick = this.onClick.bind (this);
}
render () {
  return <div onClick={this.onClick}>Click me</div>;
}
```

Electrum's autobinding looks for methods starting with `on` or `handle`
and using _camel case_ (such as `onClick`); other methods won't be
automatically bound to `this`.

See also the explanation on [autobinding on the React blog](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding).


# Sending events to the bus

Electrum can use a bus to dispatch messages/commands and notify changes.
The bus interface looks like this:

```javascript
{
  dispatch (props, message) {}
  notify (props, value, ...states) {}
}
```

## Bus configuration

A bus can be attached with `Electrum.useBus(bus)`.

## Event forwarding

The default `Electrum` instance is configured to use `electrum-events`,
which injects various event handlers into the wrapped components:

* `onChange`
* `onKeyDown`, `onKeyUp`, `onKeyPress`
* `onFocus`

> Note: if the component provides its own event handlers, they will be
> called by the injected methods.

Events will automatically be sent to the bus, if one has been configured
(see `Electrum.use`). The `EventHandlers` class in `electrum-events` is
in charge of the event forwarding. It will provide the _value_ and the
_states_ associated with the underlying component, usually by reading
the DOM:

* `value` &larr; `event.target.value`
* `states` &larr; `{begin:0, end:10}` for text fields

## Custom value or states

When the defaults are not meaningful (e.g. for a `checkbox`, where the
_value_ does not exist per se), the component can provide the value
(method `getValue()`) or the states (method `getStates()`):

```javascript
class MyCheckbox extends React.Component {
  render () {
    return <input type='checkbox' /* ... */ />;
  }
  getValue (target) {
    // The value will be 'on' or 'off', depending on the checked state
    // of the target DOM node:
    return target.checked ? 'on' : 'off';
  }
}
```

# Automating component wrapping

The easiest way to get all components of a module wrapped is to use the
`electrum-require-components` module.

See [electrum-require-components](https://github.com/epsitec-sa/electrum-require-components).

## Install electrum-require-components

```
npm install electrum-require-components --save-dev
```

## Configure your package

Edit `package.json` to add a script that can be invoked with `npm run regen`
in order to regenerate the source file `all.js` which includes, wraps and exports
all components.

```
"scripts": {
  ...
  "regen": "electrum-require-components --wrap ./src components .component.js all.js"
}
```

## Export all wrapped components

To export all components found in your module, use:

```javascript
export * from './all.js';
```

# Tracing

Electrum includes basic tracing functionality, which might come in handy when
live debugging wrapped components.

## shouldComponentUpdate()

Whenever React calls a wrapped component's `shouldComponentUpdate()`, Electrum
will call the corresponding logging function:

```javascript
import E from 'electrum';
E.configureLog ('shouldComponentUpdate', (component, nextProps, nextState, result) => { /* ... */ });
```

The arguments are:

* `component` &rarr; component instance.
* `nextProps` &rarr; next properties, as provided to `shouldComponentUpdate`.
* `nextState` &rarr; next state, as provided to `shouldComponentUpdate`.
* `result` &rarr; result of the call to `shouldComponentUpdate`, where `true`
  means that the component should be rendered.

# States and fingerprints

Components may need to represent their internal state as a collection of simple
state objects:

```javascript
const fieldSelection = { from: 12, to: 17 };     // 'from,to'
const listSelection  = { first: 5, active: 8 };  // 'active,first'
```

These state objects have _fingerprints_ which are based on their sorted
property names (`'from,to'`, `'active,first'`). It does not include the
optional `id` property.

## FieldStates class

The `FieldStates` class maintains an internal array of state objects.
It is implemented in `electrum-field` and made available by `electrum`
as a convenience.

### Query the field states

* `FieldStates.fingerprint (state)` &rarr; the fingerprint of a state object.
* `find (fingerprint)` &rarr; the first state object which matches the
  specified fingerprint, or `undefined` if none can be found.
* `get ()` &rarr; an immutable array of immutable state objects.

### Update the field states

The instances are immutable. All methods which modify the internal array
of state objects will return a new instance (or the unchanged instance if
the update was a no-op). The original instance is never modified.

* `add (state)` &rarr; a new instance where the internal array of states has
  been updated by adding or replacing a state; matching is done based on the
  state's fingerprint.
* `add (state1, state2, ...)` &rarr; same as `add()` called multiple times.
* `remove (fingerprint)` &rarr; a new instance where the internal array of
  states has been updated by removing the first state matching the specified
  fingerprint.

# Actions

Electrum prescribes how actions represent their specific state and
provides the `Action` class to inspect it:

* `Action.isEnabled (state)` &rarr; `true` if the state is enabled.
* `Action.isDisabled (state)` &rarr; `true` if the state is disabled.

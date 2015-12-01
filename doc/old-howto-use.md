### How to use Electrum

To include and configure **Electrum** in a JavaScript project, simply
`npm install electrum`. Then:

```js
import Electrum as 'electrum';

var Radium = /* ...provide a reference to the Radium library... */
var Lydia  = /* ...provide a reference to the Lydia.js library... */

var E = new Electrum (Radium, Lydia);

var Component = E.createClass ({...});

// or

var E = new Electrum ();
E.use (Radium);
E.use (Lydia);

var Component = E.createClass ({...});

// or

var Component = new Electrum ()
  .use (Radium)
  .use (Lydia)
  .createClass ({...});
```

Create React components with `E.createClass({...})` instead of
`React.createClass({...})`. Electrum takes care of extending the
provided object, for instance to include a call to `Radium.wrap()`,
etc.

When several wrappers are applied (as in the example above), then
they will be applied right to left:

```js
var E = new Electrum (Radium, Lydia);
var C = E.createClass ({});
```
is thus equivalent to:
```js
var C = React.createClass (Radium.wrap (Lydia.wrap ({})));
```

### Wrappers

The wrappers must conform to the following interface:

```js
var Wrapper = {
  wrap: obj => obj,                // mandatory: wrap function
  getElectrumApi: () => {/*API*/}  // optional: get Electrum API implementation
  getElectrumBus: () => {/*Bus*/}  // optional: get Electrum Bus implementation
};
```

#### Providing external services

Electrum provides access to external services which are useful
when implementing React components:

* The [Electrum API](doc/API.md) provides:
   * _Read services_ to get the text, value, style and state
     associated with a component;
   * _Write services_ to change the value and state of a component
     as a result of a direct user action on the component.
* The [Electrum Bus](doc/Bus.md) provides:
   * A method to _dispatch_ user actions to the backend.
   * A method to _notify_ the backend when data changes.

At least one wrapper should provide an implementation of the
[Electrum API](API.md) and one should provide an implementation
of the [Electrum Bus](Bus.md).

**Interface for the Electrum API**

```js
getState: function (obj, what) {},
setState: function (obj, ...states) {},
getStyle: function (obj) {},
getText:  function (obj) {},
getValue: function (obj) {},
setValue: function (obj, value, ...states) {}
```

**Interface for the Electrum bus**

```js
dispatch: function (obj, message) {},
notify:   function (obj, value, ...states) {}
```

### What will Electrum do, besides `createClass`?

_This is not yet implemented in version 0.3.x_

Electrum provides an entry point to the style objects used in conjunction with Radium.
Themes are broken down into distinct axes:

* Palette &rarr; color, gradients, filters, etc.
* Typography &rarr; fonts, spacing, padding, etc.
* Shape &rarr; corners, geometric properties, spacing, padding, etc.
* Animation &rarr; transitions, timings, etc.

These collection of partial styles and constants can be accessed through the `palette`,
`typo`, `shape` and `animation` Electrum properties.

Example (don't take it too seriously, though):

```js
var boxStyles = [
  E.palette.colors.box.background,
  E.typo.title,
  {
    height: E.shape.defaultBarHeight,
    opacity: 0.8,
    ':hover': {
      height: E.shape.defaultBarHeight * 1.2,
      opacity: 1.0,
      transition: { height: E.animation.open, opacity: E.animation.pop }
    }
  }
];
```

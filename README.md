# Electrum

**Electrum** simplifies framework-agnostic declaration of React components and is used
internally by [Epsitec SA](https://github.com/epsitec-sa/) to bridge the gap with its
_Xcraft toolchain_ and with its _Lydia framework_.

### How to use Electrum

To include and configure **Electrum** in a JavaScript project, simply `npm install electrum`.
Then:

```js
var Electrum = require ('electrum');

var Lydia  = /* ...provide a reference to the Lydia.js library... */
var Radium = /* ...provide a reference to the Radium library... */

var E = new Electrum (Lydia, Radium);

var Component = E.createClass ({...});

// or

var E = new Electrum ();
E.use (Lydia);
E.use (Radium);

var Component = E.createClass ({...});


// or

var Component = new Electrum ()
  .use (Lydia)
  .use (Radium)
  .createClass ({...});
```

Create React components with `E.createClass({...})` as you normally would
with `React.createClass({...})`. Electrum takes care of extending the provided
object, for instance to include a call to `Radium.wrap()`, etc.

### What will it do, besides `createClass`?

_This is not yet implemented in version 0.0.x_

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

### Where does the name Electrum come from?

[_Electrum_](http://en.wikipedia.org/wiki/Electrum) is an alloy of gold and silver used to
produce ancient [Lydian](http://en.wikipedia.org/wiki/Lydia) coinage.

> The first metal coins ever made, were of Electrum and date back to the end of the 7th century,
> beginning of the 6th century BC.

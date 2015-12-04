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
the `props` of the component and the `id` of the value to read:

```javascript
import E from 'electrum';
function Content (props) {
  return (
    <div>
      <h1>{E.read (props, 'title')}</h1>
      <p>{E.read (props, 'text')}</p>
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
* `read(id)` &rarr; shorthand for `Electrum.read(this.props, id)`.
* `theme` &rarr; shorthand for `this.props.theme`.
* `styles` &rarr; resolves the _styles_ based on rules implemented by `Style`.

The component is also extended by [Radium](https://github.com/FormidableLabs/radium)
which will flatten `styles` arrays injected in child components, and handle the
state required to handle browser states such as `:hover`.

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

> Note: as of December 4 2015, Babel 6 chokes on source files with only
> a _wildcard export_. See [this issue](https://phabricator.babeljs.io/T2763).
> The error message is:
>
> _Invariant Violation: src/components.js: To get a node path the parent
> needs to exist_
>
> A workaround is to first import, then export:
>
```javascript
import * as all from './all.js';
export * from './all.js';
```

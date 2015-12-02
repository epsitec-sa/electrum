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

'use strict';

import {expect} from 'mai-chai';
import {Store} from 'electrum-store';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import E from '../index.js';
import {Content} from '../all-components.js';

/******************************************************************************/

expect (Content.displayName).to.equal ('Content');

Store.read = function read (props, id) {
  const {state} = props;
  return state.get (id);
};

let log = '';

const Author = E.wrap ('Author', class extends React.Component {
  render () {
    log = log + '/Author';
    return <div>
      <img src={Store.read (this.props, 'imageUrl')} />
      <span>{Store.read (this.props, 'displayName')}</span>
    </div>;
  }
});

const Post = E.wrap ('Post', class extends React.Component {
  render () {
    log = log + '/Post';
    return <div>
      <Content {...E.link (this.props, 'content')} />
      <Author {...E.link (this.props, 'author')} />
    </div>;
  }
});

const store = Store.create ();
store.select ('blog.post-1.content').set ('text', 'Hello, world...');
store.select ('blog.post-1.author').set ('imageUrl', 'http://ima.ge/', 'displayName', 'John');

const post = <Post state={store.select ('blog.post-1')} />;
const html = ReactDOMServer.renderToStaticMarkup (post);

console.log (html);
console.log (log);

const mountNode = document.getElementById ('root');
log = '';
ReactDOM.render (<Post state={store.select ('blog.post-1')} />, mountNode);
console.log ('Rendered: ' + log);
log = '';
ReactDOM.render (<Post state={store.select ('blog.post-1')} />, mountNode);
console.log ('Rendered: ' + log);

store.select ('blog.post-1.content').set ('text', 'Bye');

log = '';
ReactDOM.render (<Post state={store.select ('blog.post-1')} />, mountNode);
console.log ('Rendered: ' + log);

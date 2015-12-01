'use strict';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import E from '../index.js';
import {Store} from 'electrum-store';
import {Content} from '../all-components.js';

console.log ('%O', E.link ({theme: 1}));
console.log ('Component name: <' + Content.displayName + '>');

Store.read = function read (props, id) {
  const {state} = props;
  return state.get (id);
};

let log = '';

class Author extends React.Component {
  render () {
    log = log + '/Author';
    return <div>
      <img src={Store.read (this.props, 'imageUrl')} />
      <span>{Store.read (this.props, 'displayName')}</span>
    </div>;
  }
}

class Post extends React.Component {
  render () {
    log = log + '/Post';
    return <div>
      <Content {...E.link (this.props, 'content')} />
      <Author {...E.link (this.props, 'author')} />
    </div>;
  }
}

const store = Store.create ();
store.select ('blog.post-1.content').set ('text', 'Hello, world...');
store.select ('blog.post-1.author').set ('imageUrl', 'http://ima.ge/', 'displayName', 'John');

const post = <Post state={store.select ('blog.post-1')} />;
const html = ReactDOMServer.renderToStaticMarkup (post);

console.log (html);
console.log (log);

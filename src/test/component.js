'use strict';

import {expect} from 'mai-chai';
import {Store} from 'electrum-store';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import E from '../index.js';
import {Content} from '../all-components.js';

/******************************************************************************/

let log = '';

/******************************************************************************/

const Author = E.wrap ('Author', class extends React.Component {
  render () {
    log = log + '/Author';
    return <div>
      <img src={this.read ('imageUrl')} />
      <span>{this.read ('displayName')}</span>
    </div>;
  }
});

/******************************************************************************/

const Post = E.wrap ('Post', class extends React.Component {
  render () {
    log = log + '/Post';
    return <div>
      <Content {...this.link ('content')} />
      <Author {...this.link ('author')} />
    </div>;
  }
});

/******************************************************************************/

const store = Store.create ();
store.select ('blog.post-1.content').set ('text', 'Hello, world...');
store.select ('blog.post-1.author').set ('imageUrl', 'http://ima.ge/', 'displayName', 'John');


describe ('Component', () => {
  describe ('Setup', () => {
    it ('produces named components', () => {
      expect (Content.displayName).to.equal ('Content');
      expect (Author.displayName).to.equal ('Author');
      expect (Post.displayName).to.equal ('Post');
    });
  });

  describe ('Use', () => {
    it ('produces expected HTML code', () => {
      const post = <Post state={store.select ('blog.post-1')} />;
      const html = ReactDOMServer.renderToStaticMarkup (post);
      expect (html).to.equal (
        '<div>' +
        '<div>Hello, world...</div>' +
        '<div><img src="http://ima.ge/"/><span>John</span></div>' +
        '</div>');
    });

    it ('re-renders only when store changes', () => {
      const mountNode = document.getElementById ('root');

      log = '';
      ReactDOM.render (<Post state={store.select ('blog.post-1')} />, mountNode);
      expect (log).to.equal ('/Post/Author');

      log = '';
      ReactDOM.render (<Post state={store.select ('blog.post-1')} />, mountNode);
      expect (log).to.equal ('');

      // Mutate the store; this will re-render <Content>, but not <Author>
      store.select ('blog.post-1.content').set ('text', 'Bye');

      log = '';
      ReactDOM.render (<Post state={store.select ('blog.post-1')} />, mountNode);
      expect (log).to.equal ('/Post');
    });
  });
});

/******************************************************************************/

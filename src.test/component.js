/* global describe it document */

import {expect} from 'mai-chai';
import {Store} from 'electrum-store';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import Electrum from 'electrum';

import {Content} from '../src/all-components.js';

/******************************************************************************/

let log = '';

/******************************************************************************/
/* eslint react/display-name: 0 */

const Author = Electrum.wrap ('Author', class extends React.Component {
  render () {
    log = log + '/Author';
    return (
      <div>
        <img src={this.read ('imageUrl')} />
        <span>{this.read ('displayName')}</span>
      </div>
    );
  }
});

/******************************************************************************/

const Post = Electrum.wrap ('Post', class extends React.Component {
  render () {
    log = log + '/Post';
    return (
      <div>
        <Content {...this.link ('content')} />
        <Author {...this.link ('author')} />
      </div>
    );
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
        '<div data-radium="true">' +
        '<div id="text">Hello, world...</div>' +
        '<div data-radium="true"><img src="http://ima.ge/"/><span>John</span></div>' +
        '</div>');
    });

    it ('re-renders only when store changes', () => {
      const mountNode = document.getElementById ('root');
      let spy;
      Electrum.configureLog ('shouldComponentUpdate', (o, p, s, dirty) => {
        spy += `/${o.constructor.displayName}: ${dirty}`;
      });

      spy = '';
      log = '';
      ReactDOM.render (<Post state={store.select ('blog.post-1')} />, mountNode);
      expect (log).to.equal ('/Post/Author');
      expect (spy).to.equal ('');

      spy = '';
      log = '';
      ReactDOM.render (<Post state={store.select ('blog.post-1')} />, mountNode);
      expect (log).to.equal ('');
      expect (spy).to.equal ('/Post: false');

      // Mutate the store; this will re-render <Content>, but not <Author>
      store.select ('blog.post-1.content').set ('text', 'Bye');

      spy = '';
      log = '';
      ReactDOM.render (<Post state={store.select ('blog.post-1')} />, mountNode);
      expect (log).to.equal ('/Post');
      expect (spy).to.equal ('/Post: true/Content: true/Author: false');

      Electrum.configureLog ('shouldComponentUpdate');
    });
  });
});

/******************************************************************************/

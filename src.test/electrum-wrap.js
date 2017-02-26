/* global describe it */

import {expect} from 'mai-chai';
import React from 'react';
import E, {Electrum} from 'electrum';

import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

/******************************************************************************/

let Link = E.wrap ('Link', class extends React.Component {

  onClick () {
    Link.clickCount++;
    if (Link.linkThis === this) {
      Link.linkThisOk++;
    }
  }

  static reset () {
    Link.linkThisOk = 0;
    Link.clickCount = 0;
  }

  render () {
    Link.linkThis = this;
    return (
      <div onClick={this.onClick}>Link</div>
    );
  }
});

/******************************************************************************/

describe ('Electrum', () => {
  describe ('wrap()', () => {
    it ('wraps React components defined as a class', () => {
      const wrapper = {wrap: c => (c.test = 42, c)};
      const e = new Electrum (wrapper);

      class Component extends React.Component {
        render () {
          return <div>{this.props.text}</div>;
        }
      }

      const wrapped = e.wrap ('comp', Component);

      expect (wrapped.prototype).to.have.property ('render');
      expect (wrapped.prototype).to.have.property ('shouldComponentUpdate');
      expect (wrapped).to.have.property ('displayName', 'comp');
      expect (wrapped).to.have.property ('test', 42);
    });

    it ('wraps stateless function components', () => {
      const wrapper = {wrap: c => (c.test = 42, c)};
      const e = new Electrum (wrapper);
      const Component = props => <div>{props.text}</div>;

      const wrapped = e.wrap ('comp', Component);

      expect (wrapped.prototype).to.have.property ('render');
      expect (wrapped.prototype).to.have.property ('shouldComponentUpdate');
      expect (wrapped).to.have.property ('displayName', 'comp');
      expect (wrapped).to.have.property ('test', 42);
    });

    it ('wraps React components defined with React.createClass', () => {
      const wrapper = {wrap: c => (c.test = 42, c)};
      const e = new Electrum (wrapper);

      const Component = React.createClass ({
        render: function () {
          return <div>{this.props.text}</div>;
        }
      });

      const wrapped = e.wrap ('comp', Component);

      expect (wrapped.prototype).to.have.property ('render');
      expect (wrapped.prototype).to.have.property ('shouldComponentUpdate');
      expect (wrapped).to.have.property ('displayName', 'comp');
      expect (wrapped).to.have.property ('test', 42);
    });

    it ('auto binds event handlers', () => {
      const element = <Link />;
      const mountNode = document.getElementById ('root');
      const instance = ReactDOM.render (element, mountNode);
      const node = ReactDOM.findDOMNode (instance);
      expect (node.localName).to.equal ('div');
      Link.reset ();
      ReactTestUtils.Simulate.click (node);
      expect (Link.clickCount).to.equal (1);
      expect (Link.linkThisOk).to.equal (1);
    });

    it ('throws on invalid argumens', () => {
      const wrapper = {wrap: c => (c.test = 42, c)};
      const e = new Electrum (wrapper);

      const Component = class Component extends React.Component {};

      expect (() => e.wrap ('comp', Component)).to.throw (Error);
      expect (() => e.wrap ('comp', function () {})).to.throw (Error);
      expect (() => e.wrap ('comp', (a, b) => a || b)).to.throw (Error);
    });
  });
});

/******************************************************************************/

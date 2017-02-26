/* global describe it */

import {expect} from 'mai-chai';

import React from 'react';

import {
  Simulate,
  renderIntoDocument,
  findRenderedDOMComponentWithTag
} from 'react-addons-test-utils';

import Electrum from 'electrum';

/******************************************************************************/

class CustomBus {
  constructor () {
    this.clearLog ();
  }
  clearLog () {
    this._log = '';
  }
  get log () {
    return this._log;
  }
  dispatch (props, action) {
    this._log += `/dispatch id=${props.id} ${action}`;
  }
  notify (props, source, value, ...states) {
    this._log += `/notify id=${props.id} value="${value}" states=${JSON.stringify (states)}`;
  }
}

/******************************************************************************/

const bus = new CustomBus ();

Electrum.reset ();
Electrum.useBus (bus);

/******************************************************************************/

class _Foo extends React.Component {
  getValue (target) {
    return target.checked ? 'on' : 'off';
  }
  getStates () {
    return [];
  }
  render () {
    return <input id={this.props.id} type='checkbox' onChange={this.onChange} onFocus={this.onFocus}/>;
  }
}

class _Bar extends React.Component {
  render () {
    return <input id={this.props.id} type='text' onChange={this.onChange}/>;
  }
}

const Foo = Electrum.wrap ('Foo', _Foo);
const Bar = Electrum.wrap ('Bar', _Bar);

/******************************************************************************/

describe ('EventHandlers', () => {
  describe ('onChange event', () => {
    it ('Foo/checkbox posts an event on the bus', () => {
      const component = renderIntoDocument (<Foo id='1' />);
      const input = findRenderedDOMComponentWithTag (component, 'input');
      expect (input).to.have.property ('type', 'checkbox');

      bus.clearLog ();
      input.checked = true;
      Simulate.change (input);
      expect (bus.log).to.equal ('/notify id=1 value="on" states=[]');

      bus.clearLog ();
      input.checked = false;
      Simulate.change (input);
      expect (bus.log).to.equal ('/notify id=1 value="off" states=[]');
    });

    it ('Bar/text posts an event on the bus', () => {
      const component = renderIntoDocument (<Bar id='1' />);
      const input = findRenderedDOMComponentWithTag (component, 'input');
      expect (input).to.have.property ('type', 'text');

      bus.clearLog ();
      input.value = 'John';
      Simulate.change (input);
      expect (bus.log).to.equal ('/notify id=1 value="John" states=[{"from":0,"to":0}]');

      bus.clearLog ();
      input.value = 'Jane';
      Simulate.change (input);
      expect (bus.log).to.equal ('/notify id=1 value="Jane" states=[{"from":0,"to":0}]');
    });
  });

  describe ('onFocus event', () => {
    it ('Foo/checkbox posts an event on the bus', () => {
      const component = renderIntoDocument (<Foo id='1' />);
      const input = findRenderedDOMComponentWithTag (component, 'input');
      expect (input).to.have.property ('type', 'checkbox');

      bus.clearLog ();
      Simulate.focus (input);
      expect (bus.log).to.equal ('/notify id=1 value="off" states=[]/dispatch id=1 focus');
    });
  });
});

/******************************************************************************/

'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import {Simulate, renderIntoDocument, findRenderedDOMComponentWithTag} from 'react-addons-test-utils';

import IBus from '../interfaces/bus.js';
import Electrum from '../index.js';

console.log (IBus);

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
    this._log += `/dispatch ${action}`;
  }
  notify (props, value, ...states) {
    this._log += `/notify value=${value}`;
  }
}

const bus = new CustomBus ();

Electrum.reset ();
Electrum.use ({getElectrumBus: () => bus});

class _Foo extends React.Component {
  getValue (target) {
    return target.checked ? 'on' : 'off';
  }
  render () {
    return <input id={this.props.id} type='checkbox' onChange={this.onChange}/>;
  }
}

const Foo = Electrum.wrap ('Foo', _Foo);

describe ('Electrum bus', () => {
  describe ('handleChange()', () => {
    it ('posts an event on the bus', () => {
      const component = renderIntoDocument (<Foo id='1.1' />);
      const input = findRenderedDOMComponentWithTag (component, 'input');
      expect (input).to.have.property ('type', 'checkbox');

      bus.clearLog ();
      input.checked = true;
      Simulate.change (input);
      expect (bus.log).to.equal ('/notify value=on');

      bus.clearLog ();
      input.checked = false;
      Simulate.change (input);
      expect (bus.log).to.equal ('/notify value=off');
    });
  });
});

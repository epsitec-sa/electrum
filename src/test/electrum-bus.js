'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import {Simulate, renderIntoDocument, findRenderedDOMComponentWithTag} from 'react-addons-test-utils';

import IBus from '../interfaces/bus.js';
import Electrum from '../index.js';

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
  notify (props, value) {
    this._log += `/notify id=${props.id} value=${value}`;
  }
}

/******************************************************************************/

const bus = new CustomBus ();

Electrum.reset ();
Electrum.use ({getElectrumBus: () => bus});

/******************************************************************************/

class _Foo extends React.Component {
  getValue (target) {
    return target.checked ? 'on' : 'off';
  }
  render () {
    return <input id={this.props.id} type='checkbox' onChange={this.onChange} onFocus={this.onFocus}/>;
  }
}

const Foo = Electrum.wrap ('Foo', _Foo);

/******************************************************************************/

describe ('EventHandlers', () => {
  describe ('onChange event', () => {
    it ('posts an event on the bus', () => {
      const component = renderIntoDocument (<Foo id='1' />);
      const input = findRenderedDOMComponentWithTag (component, 'input');
      expect (input).to.have.property ('type', 'checkbox');

      bus.clearLog ();
      input.checked = true;
      Simulate.change (input);
      expect (bus.log).to.equal ('/notify id=1 value=on');

      bus.clearLog ();
      input.checked = false;
      Simulate.change (input);
      expect (bus.log).to.equal ('/notify id=1 value=off');
    });
  });

  describe ('onFocus event', () => {
    it ('posts an event on the bus', () => {
      const component = renderIntoDocument (<Foo id='1' />);
      const input = findRenderedDOMComponentWithTag (component, 'input');
      expect (input).to.have.property ('type', 'checkbox');

      bus.clearLog ();
      Simulate.focus (input, {
        stopPropagation: function () {
          console.log ('stop');
        }, preventDefault: function () {
          console.log ('prevent');
        }});
      expect (bus.log).to.equal ('/notify id=1 value=off/dispatch id=1 focus');
    });
  });
});

/******************************************************************************/

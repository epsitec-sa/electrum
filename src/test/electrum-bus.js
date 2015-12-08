'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import {Simulate, renderIntoDocument, findRenderedDOMComponentWithTag} from 'react-addons-test-utils';

import IBus from '../interfaces/bus.js';
import Electrum from '../index.js';

console.log (IBus);

class CustomBus {
  dispatch () {
    console.log ('Dispatch called');
  }
  notify (props, value, ...states) {
    console.log ('Notify called');
    console.log (` props=${JSON.stringify (props)}`);
    console.log (` value="${value}"`);
    console.log (` states=${JSON.stringify (states)}`);
  }
}

Electrum.reset ();
Electrum.use ({getElectrumBus: () => new CustomBus ()});

class _Foo extends React.Component {
  onChange (ev) {
    console.log ('onChange called: ', ev);
    this.eventHandlers.handleChange (ev);
  }
  render () {
    return <input id={this.props.id} type='checkbox' onChange={this.onChange}/>;
  }
}

class _FooX extends _Foo {
  render () {
    const result = super.render ();
    console.log (this.onChange);
    console.log ('%O', result);
    console.log (result.props);
    console.log ('%O', result.props.onChange);

    const onChange = result.props.onChange;

    console.log (onChange.name);
    console.log (Object.keys (this));
    console.log (onChange === this.onChange);

    const onChangeNew = e => onChange.call (this, e);

    return React.cloneElement (result, {onChange: onChangeNew});
  }
}

const Foo = Electrum.wrap ('Foo', _FooX);

describe ('Electrum bus', () => {
  describe ('handleChange()', () => {
    it ('posts an event on the bus', () => {
      const component = renderIntoDocument (<Foo id='1.1' />);
      const input = findRenderedDOMComponentWithTag (component, 'input');
      expect (input).to.have.property ('type', 'checkbox');
      Simulate.change (input);
    });
  });
});

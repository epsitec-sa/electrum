'use strict';

import {expect} from 'mai-chai';
import React from 'react';
import {Electrum} from '../index.js';

/*****************************************************************************/

describe ('Electrum', () => {
  describe ('wrap()', () => {
    it ('wraps React components', () => {
      const wrapper = {wrap: c => (c.test = 42, c)};
      const e = new Electrum (wrapper);

      class Component extends React.Component {
        render () {
          return <div>{this.props.text}</div>;
        }
    }

      const wrapped = e.wrap ('comp', Component);

      expect (wrapped.prototype).to.have.property ('displayName', 'comp');
      expect (wrapped).to.have.property ('test', 42);
    });

    it ('wraps stateless function components', () => {
      const wrapper = {wrap: c => (c.test = 42, c)};
      const e = new Electrum (wrapper);
      const Component = props => <div>{props.text}</div>;
      const wrapped = e.wrap ('comp', Component);

      expect (wrapped.prototype).to.have.property ('displayName', 'comp');
      expect (wrapped.prototype).to.have.property ('render');
      expect (wrapped).to.have.property ('test', 42);
    });
  });
});

/*****************************************************************************/

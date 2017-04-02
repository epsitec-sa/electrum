/* global describe it */

import {expect} from 'mai-chai';
import React from 'react';

import {isComponent} from '../src/utils/is-component.js';
import {isStatelessFunctionComponent} from '../src/utils/is-stateless-function-component.js';

/******************************************************************************/

describe ('Electrum utils/is...', () => {
  describe ('isComponent()', () => {
    const Foo = class extends React.Component {
      render () {
        return <div>Foo</div>;
      }
    };
    Foo.displayName = 'Foo';
    const StatelessFoo = props => <div>{props.text}</div>;

    it ('identifies full component', () => {
      expect (isComponent (Foo)).to.be.true ();
      expect (isStatelessFunctionComponent (Foo)).to.be.false ();
    });

    it ('identifies stateless function component to not be a full component', () => {
      expect (isComponent (StatelessFoo)).to.be.false ();
      expect (isStatelessFunctionComponent (StatelessFoo)).to.be.true ();
    });
  });
});

/******************************************************************************/

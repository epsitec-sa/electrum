'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import radium from 'radium';

/******************************************************************************/
class Foo extends React.Component {
  render () {
    return <div>Hello</div>;
  }
}

describe ('Native Node 5 classes', () => {
  describe ('radium() wrapping', () => {
    it ('produces working code', () => {
      const RadFoo = radium (Foo);
      expect (new Foo ()).to.exist ();
      expect (new RadFoo ()).to.exist ();
    });
  });
});

'use strict';

import {expect} from 'mai-chai';
import {Electrum} from '../index.js';

/******************************************************************************/

describe ('Electrum', () => {
  describe ('constructor()', () => {
    it ('produces empty instance', () => {
      const e = new Electrum ();
      expect (e.connectors).to.deep.equal ([]);
    });

    it ('uses arguments in correct order', () => {
      var a = {wrap: c => c};
      var b = {wrap: c => c};
      var e = new Electrum (a, b);
      expect (e.connectors).to.deep.equal ([b, a]);
    });

    it ('throws if argument contains no wrapper', () => {
      expect (() => new Electrum ({})).to.throw (Error);
    });

    it ('throws if wrap is not a wrapper function', () => {
      expect (() => new Electrum ({wrap: 42})).to.throw (Error);
      expect (() => new Electrum ({wrap: () => null})).to.throw (Error);
      expect (() => new Electrum ({wrap: (a, b) => a || b})).to.throw (Error);
    });
  });
});

/******************************************************************************/

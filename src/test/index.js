'use strict';

import {expect} from 'mai-chai';
import Electrum from '../index.js';

/*****************************************************************************/

describe ('Electrum', () => {

  describe ('Construction', () => {

    it ('should not require new', () => {
      /*jshint -W064 */
      var E1 = Electrum ();
      var E2 = Electrum ();
      expect (E1.connectors).to.deep.equal ([]);
      expect (E2.connectors).to.deep.equal ([]);
      expect (E1 !== E2).to.be.true ();
    });

    it ('should accept empty argument list', () => {
      var E = new Electrum ();
      expect (E.connectors).to.deep.equal ([]);
    });

    it ('should use arguments in correct order', () => {
      var a = {
        wrap: c => c
      };
      var b = {
        wrap: c => c
      };
      var E = new Electrum (a, b);
      expect (E.connectors).to.deep.equal ([b, a]);
    });

    it ('should throw if argument contains no wrapper', () => {
      expect (() => new Electrum ({})).to.throw (Error);
    });

    it ('should throw if wrap is not a wrapper', () => {
      expect (() => new Electrum ({wrap: 42})).to.throw (Error);
    });
  });
});

/*****************************************************************************/

describe ('Electrum', () => {

  var E = null;

  beforeEach (() => {
    E = new Electrum ();
  });

  describe ('API export', () => {

    it ('should have .use property', () => {
      var prototype = Object.getPrototypeOf (E);
      expect (prototype).to.have.property ('use');
    });

    it ('should have .createClass property', () => {
      var prototype = Object.getPrototypeOf (E);
      expect (prototype).to.have.property ('createClass');
    });
  });

  describe ('Wrapping', () => {

    var wrapper = {
      wrap: function (c) {
        c.test = 42;
        return c;
      }
    };

    var componentDefinition = {
      message: 'hello',
      render: () => {}
    };

    describe ('Should wrap correctly', () => {
      it ('using createClass (def)', () => {
        E.use (wrapper);
        var component = E.createClass (componentDefinition); /* jshint unused:false */
        expect (componentDefinition).to.have.property ('message', 'hello');
        expect (componentDefinition).to.have.property ('test', 42);
        // TODO: verify that `component` was properly created by React
      });

      it ('using createClass (name, def)', () => {
        E.use (wrapper);
        E.createClass ('Foo', componentDefinition);
        expect (componentDefinition).to.have.property ('displayName', 'Foo');
      });
    });

    describe ('Should throw', () => {

      it ('using createClass ()', () => {
        expect (() => {
          E.use (wrapper);
          E.createClass ();
        }).to.throw (Error);
      });

      it ('using createClass (def, name)', () => {
        expect (() => {
          E.use (wrapper);
          E.createClass (componentDefinition, 'Foo');
        }).to.throw (Error);
      });
    });
  });

  describe ('API injection', () => {
    it ('should inject implementation', () => {
      var wrapper = {
        wrap: c => c,
        getElectrumApi: () => {
          return { /*jshint unused:false*/
            getState: (obj, what) => 'getState',
            setState: (obj, ...states) => 'setState',
            getStyle: (obj) => 'getStyle',
            getText:  (obj) => 'getText',
            getValue: (obj) => 'getValue',
            setValue: (obj, value, ...states) => 'setValue'
          };
        }
      };

      E.use (wrapper);
      expect (E.bus).to.deep.equal ({});
      expect (E.getState ()).to.equal ('getState');
      expect (E.setState ()).to.equal ('setState');
      expect (E.getState ()).to.equal ('getState');
      expect (E.setState ()).to.equal ('setState');
      expect (E.getStyle ()).to.equal ('getStyle');
      expect (E.getText  ()).to.equal ('getText');
      expect (E.getValue ()).to.equal ('getValue');
      expect (E.setValue ()).to.equal ('setValue');
    });
  });

  describe ('Bus injection', () => {
    it ('should inject implementation', () => {
      var wrapper = {
        wrap: c => c,
        getElectrumBus: () => {
          return { /*jshint unused:false*/
            dispatch: (obj, message) => 'dispatch',
            notify: (obj, value, ...states) => 'notify'
          };
        }
      };

      E.use (wrapper);
      expect (E.bus.dispatch ()).to.equal ('dispatch');
      expect (E.bus.notify ()).to.equal ('notify');
    });
  });
});

/*****************************************************************************/

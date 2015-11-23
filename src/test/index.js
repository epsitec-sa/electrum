'use strict';

import {expect} from 'mai-chai';
import Electrum from '../index.js';

/*****************************************************************************/

describe ('Electrum', function () {

  describe ('Construction', function () {

    it ('should not require new', function () {
      /*jshint -W064 */
      var E1 = Electrum ();
      var E2 = Electrum ();
      expect (E1.connectors).to.deep.equal ([]);
      expect (E2.connectors).to.deep.equal ([]);
      expect (E1 !== E2).to.be.true ();
    });

    it ('should accept empty argument list', function () {
      var E = new Electrum ();
      expect (E.connectors).to.deep.equal ([]);
    });

    it ('should use arguments in correct order', function () {
      var a = {
        wrap: c => c
      };
      var b = {
        wrap: c => c
      };
      var E = new Electrum (a, b);
      expect (E.connectors).to.deep.equal ([b, a]);
    });

    it ('should throw if argument contains no wrapper', function () {
      expect (() => new Electrum ({})).to.throw (Error);
    });

    it ('should throw if wrap is not a wrapper', function () {
      expect (() => new Electrum ({wrap: 42})).to.throw (Error);
    });
  });
});

/*****************************************************************************/

describe ('Electrum', function () {

  var E = null;

  beforeEach (function () {
    E = new Electrum ();
  });

  describe ('API export', function () {

    it ('should have .use property', function () {
      var prototype = Object.getPrototypeOf (E);
      expect (prototype).to.have.property ('use');
    });

    it ('should have .createClass property', function () {
      var prototype = Object.getPrototypeOf (E);
      expect (prototype).to.have.property ('createClass');
    });
  });

  describe ('Wrapping', function () {

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

    describe ('Should wrap correctly', function () {
      it ('using createClass (def)', function () {
        E.use (wrapper);
        var component = E.createClass (componentDefinition); /* jshint unused:false */
        expect (componentDefinition).to.have.property ('message', 'hello');
        expect (componentDefinition).to.have.property ('test', 42);
        // TODO: verify that `component` was properly created by React
      });

      it ('using createClass (name, def)', function () {
        E.use (wrapper);
        E.createClass ('Foo', componentDefinition);
        expect (componentDefinition).to.have.property ('displayName', 'Foo');
      });
    });

    describe ('Should throw', function () {

      it ('using createClass ()', function () {
        expect (function () {
          E.use (wrapper);
          E.createClass ();
        }).to.throw (Error);
      });

      it ('using createClass (def, name)', function () {
        expect (function () {
          E.use (wrapper);
          E.createClass (componentDefinition, 'Foo');
        }).to.throw (Error);
      });
    });
  });

  describe ('API injection', function () {
    it ('should inject implementation', function () {
      var wrapper = {
        wrap: c => c,
        getElectrumApi: function () {
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

  describe ('Bus injection', function () {
    it ('should inject implementation', function () {
      var wrapper = {
        wrap: c => c,
        getElectrumBus: function () {
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

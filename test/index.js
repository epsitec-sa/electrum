'use strict';

var should   = require ('should'); /* jshint ignore:line */
var Electrum = require ('../index.js');

/*****************************************************************************/

describe ('Electrum', function () {

  describe ('Construction', function () {

    it ('should not require new', function () {
      /*jshint -W064 */
      var E1 = Electrum ();
      var E2 = Electrum ();
      E1.should.have.ownProperty ('connectors', E1);
      E1.connectors.length.should.be.equal (0);
      E2.should.have.ownProperty ('connectors', E1);
      E2.connectors.length.should.be.equal (0);
      E1.should.not.be.equal (E2);
    });

    it ('should accept empty argument list', function () {
      var E = new Electrum ();
      E.should.have.ownProperty ('connectors', E);
      E.connectors.length.should.be.equal (0);
    });

    it ('should use arguments in correct order', function () {
      var a = { wrap: function (c) { return c; }};
      var b = { wrap: function (c) { return c; }};
      var E = new Electrum (a, b);
      E.connectors.length.should.be.equal (2);
      E.connectors[1].should.be.equal (a);
      E.connectors[0].should.be.equal (b);
    });

    it ('should throw if argument contains no wrapper', function () {
      should (function () {
        var a = { };
        var E = new Electrum (a); /* jshint unused:false */
      }).throw();
    });

    it ('should throw if wrap is not a wrapper', function () {
      should (function () {
        var a = { wrap: 42 };
        var E = new Electrum (a); /* jshint unused:false */
      }).throw();
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
      prototype.should.have.ownProperty ('use', prototype);
    });

    it ('should have .createClass property', function () {
      var prototype = Object.getPrototypeOf (E);
      prototype.should.have.ownProperty ('createClass', prototype);
    });
  });

  describe ('Wrapping', function () {

    it ('should wrap correctly', function () {
      var wrapper = {
        wrap: function (c) {
          c.test = 42;
          return c;
        }
      };

      var componentDefinition = {
        message: 'hello',
        render: function () {return {};}
      };

      E.use (wrapper);

      var component = E.createClass (componentDefinition); /* jshint unused:false */

      componentDefinition.should.have.ownProperty ('message').equal ('hello');
      componentDefinition.should.have.ownProperty ('test').equal (42);

      // TODO: verify that `component` was properly created by React
    });
  });

  describe ('API injection', function () {
    it ('should inject implementation', function () {
      var wrapper = {
        wrap: c => c,
        getElectrumApi: function () {
          return { /*jshint unused:false*/
            getState: function (obj, what) { return 'getState'; },
            setState: function (obj, ...states) { return 'setState'; },
            getStyle: function (obj) { return 'getStyle'; },
            getText:  function (obj) { return 'getText'; },
            getValue: function (obj) { return 'getValue'; },
            setValue: function (obj, value, ...states) { return 'setValue'; }
          };
        }
      };

      E.use (wrapper);
      E.bus.should.be.eql ({});
      E.getState ().should.be.equal ('getState');
      E.setState ().should.be.equal ('setState');
      E.getStyle ().should.be.equal ('getStyle');
      E.getText  ().should.be.equal ('getText');
      E.getValue ().should.be.equal ('getValue');
      E.setValue ().should.be.equal ('setValue');
    });
  });

  describe ('Bus injection', function () {
    it ('should inject implementation', function () {
      var wrapper = {
        wrap: c => c,
        getElectrumBus: function () {
          return { /*jshint unused:false*/
            dispatch: function (obj, message) { return 'dispatch'; },
            notify: function (obj, value, ...states) { return 'notify'; }
          };
        }
      };

      E.use (wrapper);
      E.bus.dispatch ().should.be.equal ('dispatch');
      E.bus.notify ().should.be.equal ('notify');
    });
  });
});

/*****************************************************************************/

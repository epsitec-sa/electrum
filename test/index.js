'use strict';

var should   = require ('should'); /* jshint ignore:line */
var Electrum = require ('../index.js');

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

        render: function () {
          return {};
        }
      };

      E.use (wrapper);

      var component = E.createClass (componentDefinition);

      componentDefinition.should.have.ownProperty ('message').equal ('hello');
      componentDefinition.should.have.ownProperty ('test').equal (42);

      // TODO: verify that `component` was properly created by React
    });
  });
});

/*****************************************************************************/

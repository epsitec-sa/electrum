'use strict';

var should   = require ('should'); /* jshint ignore:line */
var Electrum = require ('../index.js');

describe ('Electrum', function () {
  var E = null;
  beforeEach (function () {
    E = Electrum.create ();
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
        wrap: function (x) {
          x.test = 42;
          return x;
        }
      };
      var component = {
        y: 42,

        render: function () {
          this.should.have.ownProperty ('test').equal (42);
          return {};
        }
      };
      E.use (wrapper);
      E.createClass (component);
      component.render ();
    });
  });
});

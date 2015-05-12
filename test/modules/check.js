'use strict';

/*jshint expr: true*/

var should = require ('should'); /* jshint ignore:line */
var check  = require ('../../modules/check.js');

/*****************************************************************************/

describe ('Electrum.check', function () {

  describe ('hasMethod', function () {

    it ('should identify existing method', function () {
      var obj1 = {foo: function () {}};
      var obj2 = {x: 1, y: ['a', 'b'], foo: function () {}, bar: x => x*2};
      should (check.hasMethod (obj1, 'foo')).be.true;
      should (check.hasMethod (obj2, 'foo')).be.true;
      should (check.hasMethod (obj2, 'bar')).be.true;
    });

    it ('should identify missing method', function () {
      var obj1 = {};
      var obj2 = {foo: 42};

      should (check.hasMethod (obj1, 'foo')).be.false;
      should (check.hasMethod (obj2, 'foo')).be.false;
    });
  });

  describe ('hasInterface', function () {

    it ('should identify presence of interface', function () {
      var obj = {foo: function () {}, bar: x => x*2, z: 42};
      should (check.hasInterface (obj, 'foo')).be.true;
      should (check.hasInterface (obj, 'bar')).be.true;
      should (check.hasInterface (obj, 'foo', 'bar')).be.true;
    });

    it ('should identify absence of interface', function () {
      var obj = {foo: function () {}, bar: x => x*2, z: 42};
      should (check.hasInterface (obj, 'gork')).be.false;
      should (check.hasInterface (obj, 'foo', 'bar', 'z')).be.false;
    });
  });

  describe ('verifyInterface', function () {

    it ('should succeed if interface matches', function () {
      var obj = {foo: function () {}, bar:x => x*2, z: 42};
      var interface1 = {foo: function () {}};
      var interface2 = {bar: function () {}};
      var interface3 = {bar: function () {}, foo: function () {}};
      should (check.verifyInterface (obj, interface1));
      should (check.verifyInterface (obj, interface2));
      should (check.verifyInterface (obj, interface3));
      should (check.verifyInterface (obj, interface1, interface2));
    });

    it ('should fail if no interface is specified', function () {
      var obj = {foo: function () {}, bar:x => x*2, z: 42};
      should (() => check.verifyInterface (obj)).throw ();
    });

    it ('should fail if interface does not match', function () {
      var obj = {foo: function () {}, bar:x => x*2, z: 42};
      var interface1 = {gork: function () {}};
      should (() => check.verifyInterface (obj, interface1)).throw ();
    });

    it ('should fail if interface specification is incorrect', function () {
      var obj = {foo: function () {}, bar:x => x*2, z: 42};
      var interface1 = {};
      var interface2 = {z: 42};
      should (() => check.verifyInterface (obj, interface1)).throw ();
      should (() => check.verifyInterface (obj, interface2)).throw ();
    });
  });
});

/*****************************************************************************/

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
});

/*****************************************************************************/

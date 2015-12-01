'use strict';

import {expect} from 'mai-chai';
import {verifyInterface, hasMethod, hasInterface} from '../utils/checks.js';

/*****************************************************************************/

describe ('Electrum utils/check', () => {
  describe ('hasMethod()', () => {

    it ('identifies existing method', () => {
      var obj1 = {
        foo: () => 'foo'
      };
      var obj2 = {
        x: 1,
        y: ['a', 'b'],
        foo: () => 'foo',
        bar: x => x * 2
      };
      expect (hasMethod (obj1, 'foo')).to.be.true ();
      expect (hasMethod (obj2, 'foo')).to.be.true ();
      expect (hasMethod (obj2, 'bar')).to.be.true ();
    });

    it ('identifies missing method', () => {
      var obj1 = {};
      var obj2 = {foo: 42};

      expect (hasMethod (obj1, 'foo')).to.be.false ();
      expect (hasMethod (obj2, 'foo')).to.be.false ();
    });
  });

  describe ('hasInterface()', () => {
    it ('identifies presence of interface', () => {
      var obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      expect (hasInterface (obj, 'foo')).to.be.true ();
      expect (hasInterface (obj, 'bar')).to.be.true ();
      expect (hasInterface (obj, 'foo', 'bar')).to.be.true ();
    });

    it ('identifies absence of interface', () => {
      var obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      expect (hasInterface (obj, 'gork')).to.be.false ();
      expect (hasInterface (obj, 'foo', 'bar', 'z')).to.be.false ();
    });
  });

  describe ('verifyInterface()', () => {
    it ('succeeds if interface matches', () => {
      var obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      var interface1 = {foo: () => {}};
      var interface2 = {bar: () => {}};
      var interface3 = {bar: () => {}, foo: () => {}};
      expect (() => verifyInterface (obj, interface1)).to.not.throw ();
      expect (() => verifyInterface (obj, interface2)).to.not.throw ();
      expect (() => verifyInterface (obj, interface3)).to.not.throw ();
      expect (() => verifyInterface (obj, interface1, interface2)).to.not.throw ();
    });

    it ('fails if no interface is specified', () => {
      var obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      expect (() => verifyInterface (obj)).to.throw (Error);
    });

    it ('fails if interface does not match', () => {
      var obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      var interface1 = {gork: () => {}};
      expect (() => verifyInterface (obj, interface1)).to.throw (Error);
    });

    it ('fails if interface specification is incorrect', () => {
      var obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      var interface1 = {};
      var interface2 = {z: 42};
      expect (() => verifyInterface (obj, interface1)).to.throw (Error);
      expect (() => verifyInterface (obj, interface2)).to.throw (Error);
    });
  });
});

/*****************************************************************************/

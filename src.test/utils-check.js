/* global describe it */

import {expect} from 'mai-chai';
import React from 'react';

import {IBus} from '../src/interfaces/bus.js';

import {
  isClass,
  isSimpleFunction,
  verifyInterface,
  getInstanceMethodNames,
  hasGetter,
  hasMethod,
  hasInterface
} from '../src/utils/checks.js';

/******************************************************************************/

describe ('Electrum utils/check', () => {
  describe ('getInstanceMethodNames()', () => {
    const Base = class extends React.Component {
      constructor () {
        super ();
      }
      foo () {}
      get theme () {
        throw new Error ('theme not ready');
      }
    };
    Base.displayName = 'Base';

    class Derived extends Base {
      bar () {}
    }
    Derived.displayName = 'Derived';

    it ('returns the expected method names', () => {
      expect (getInstanceMethodNames (new Base (), React.Component.prototype)).to.deep.equal ([ 'foo' ]);
      expect (getInstanceMethodNames (new Derived (), React.Component.prototype)).to.deep.equal (['bar', 'foo']);
    });
  });

  describe ('hasMethod()', () => {
    it ('identifies existing method', () => {
      const obj1 = {
        foo: () => 'foo'
      };
      const obj2 = {
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
      const obj1 = {};
      const obj2 = {foo: 42};
      expect (hasMethod (obj1, 'foo')).to.be.false ();
      expect (hasMethod (obj2, 'foo')).to.be.false ();
    });

    it ('does not identify getters as methods', () => {
      const obj = {get foo () {}};
      expect (hasMethod (obj, 'foo')).to.be.false ();
    });

    it ('is robust with respect to faulty getters', () => {
      const obj = {get foo () {
        throw new Error ('error');
      }};
      expect (hasMethod (obj, 'foo')).to.be.false ();
    });
  });

  describe ('hasGetter()', () => {
    it ('identifies a getter', () => {
      const obj1 = {
        get foo () {
          return 'foo';
        }
      };
      const obj2 = {
        get foo () {
          throw new Error ('error');
        }
      };
      expect (hasGetter (obj1, 'foo')).to.be.true ();
      expect (hasGetter (obj2, 'foo')).to.be.true ();
    });
  });

  /****************************************************************************/

  describe ('hasInterface()', () => {
    it ('identifies presence of interface', () => {
      const obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      expect (hasInterface (obj, 'foo')).to.be.true ();
      expect (hasInterface (obj, 'bar')).to.be.true ();
      expect (hasInterface (obj, 'foo', 'bar')).to.be.true ();
    });

    it ('identifies absence of interface', () => {
      const obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      expect (hasInterface (obj, 'gork')).to.be.false ();
      expect (hasInterface (obj, 'foo', 'bar', 'z')).to.be.false ();
    });
  });

  /****************************************************************************/

  describe ('isSimpleFunction()', () => {
    it ('identifies a function', () => {
      expect (isSimpleFunction (() => 0)).to.be.true ();
      expect (isSimpleFunction (function (a, b) {
        return a || b;
      })).to.be.true ();
    });

    it ('identifies a class to not be a function', () => {
      expect (isClass (class Foo {})).to.be.true ();
      expect (isSimpleFunction (class Foo {})).to.be.false ();
    });
  });

  /****************************************************************************/

  describe ('isClass()', () => {
    it ('identifies a class as a class', () => {
      class Obj {}
      expect (isClass (Obj)).to.be.true ();
    });

    it ('identifies a function as not a class', () => {
      function Func () {}
      expect (isClass (Func)).to.be.false ();
    });
  });

  /****************************************************************************/

  describe ('verifyInterface()', () => {
    it ('succeeds if interface matches', () => {
      const obj = {
        foo: () => 'foo',
        z: 42
      };
      obj.bar = x => x * 2;
      var interface1 = {foo: () => {}};
      var interface2 = {bar: () => {}};
      var interface3 = {bar: () => {}, foo: () => {}};
      expect (() => verifyInterface (obj, interface1)).to.not.throw ();
      expect (() => verifyInterface (obj, interface2)).to.not.throw ();
      expect (() => verifyInterface (obj, interface3)).to.not.throw ();
      expect (() => verifyInterface (obj, interface1, interface2)).to.not.throw ();
    });

    it ('succeeds if interface matches on class instance methods', () => {
      class Obj {
        foo () {}
        bar (x) {
          return x * 2;
        }
        get z () {
          return 42;
        }
      }
      var interface1 = {foo: () => {}};
      var interface2 = {bar: () => {}};
      var interface3 = {bar: () => {}, foo: () => {}};
      const obj = new Obj ();
      expect (() => verifyInterface (obj, interface1)).to.not.throw ();
      expect (() => verifyInterface (obj, interface2)).to.not.throw ();
      expect (() => verifyInterface (obj, interface3)).to.not.throw ();
      expect (() => verifyInterface (obj, interface1, interface2)).to.not.throw ();
    });

    it ('succeeds if interface matches on static class methods', () => {
      class Obj {
        static foo () {}
        static bar (x) {
          return x * 2;
        }
      }
      var interface1 = {foo: () => {}};
      var interface2 = {bar: () => {}};
      var interface3 = {bar: () => {}, foo: () => {}};
      expect (() => verifyInterface (Obj, interface1)).to.not.throw ();
      expect (() => verifyInterface (Obj, interface2)).to.not.throw ();
      expect (() => verifyInterface (Obj, interface3)).to.not.throw ();
      expect (() => verifyInterface (Obj, interface1, interface2)).to.not.throw ();
    });

    it ('succeeds if interface matches on class methods', () => {
      class Obj {
        foo () {}
        bar (x) {
          return x * 2;
        }
      }
      var interface1 = {foo: () => {}};
      var interface2 = {bar: () => {}};
      var interface3 = {bar: () => {}, foo: () => {}};
      expect (() => verifyInterface (Obj, interface1)).to.not.throw ();
      expect (() => verifyInterface (Obj, interface2)).to.not.throw ();
      expect (() => verifyInterface (Obj, interface3)).to.not.throw ();
      expect (() => verifyInterface (Obj, interface1, interface2)).to.not.throw ();
    });

    it ('succeeds with IBus interface', () => {
      class Obj {
        dispatch () {}
        notify () {}
      }
      expect (() => verifyInterface (Obj, IBus)).to.not.throw ();
    });

    it ('throws if no interface is specified', () => {
      const obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      expect (() => verifyInterface (obj)).to.throw (Error);
    });

    it ('throws if interface does not match', () => {
      const obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      const interface1 = {gork: () => {}};
      expect (() => verifyInterface (obj, interface1)).to.throw (Error);
    });

    it ('throws if interface specification is incorrect', () => {
      const obj = {
        foo: () => 'foo',
        bar: x => x * 2,
        z: 42
      };
      const interface1 = {};
      const interface2 = {z: 42};
      expect (() => verifyInterface (obj, interface1)).to.throw (Error);
      expect (() => verifyInterface (obj, interface2)).to.throw (Error);
    });
  });
});

/******************************************************************************/

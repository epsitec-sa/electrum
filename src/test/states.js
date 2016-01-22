'use strict';

import {expect} from 'mai-chai';
import {States} from '../index.js';

describe ('States', () => {
  describe ('States.fingerprint()', () => {
    it ('empty state produces empty fingerprint', () => {
      expect (States.fingerprint ({})).to.equal ('');
      expect (States.fingerprint ({id: 1})).to.equal ('');
    });

    it ('similar state produces same fingerprint', () => {
      expect (States.fingerprint ({a: 1, b: 2})).to.equal ('a,b');
      expect (States.fingerprint ({b: 1, a: 2})).to.equal ('a,b');
    });
  });

  describe ('States.findState()', () => {

    const state1 = {a: 1, b: 2};
    const state2 = {x: 1, y: 2};
    const state3 = {x: 1, y: 2, z: 3};

    const states = [state1, state2, state3];

    it ('finds state based on fingerprint', () => {
      expect (States.findState (states, 'a,b')).to.equal (state1);
      expect (States.findState (states, 'x,y')).to.equal (state2);
      expect (States.findState (states, 'x,y,z')).to.equal (state3);
    });

    it ('returns null on mismatch', () => {
      expect (States.findState (states, 'b,a')).to.be.null ();
      expect (States.findState (states, 'x')).to.be.null ();
    });
  });

  describe ('States.replaceState()', () => {

    const state1 = {a: 1, b: 2};
    const state2 = {x: 1, y: 2};
    const state3 = {x: 1, y: 2, z: 3};

    it ('replaces state based on fingerprint', () => {
      const states = [state1, state2, state3];
      const result = States.replaceState (states, {a: 10, b: 20});
      expect (result[0]).to.have.property ('a', 10);
      expect (result[0]).to.have.property ('b', 20);
      expect (result[1]).to.equal (state2);
      expect (result[2]).to.equal (state3);
    });

    it ('adds new state if it does not exist', () => {
      const states = [state1, state2, state3];
      const result = States.replaceState (states, {m: 10, n: 20});
      expect (result[0]).to.equal (state1);
      expect (result[1]).to.equal (state2);
      expect (result[2]).to.equal (state3);
      expect (result[3]).to.have.property ('m', 10);
      expect (result[3]).to.have.property ('n', 20);
    });

    it ('adds new state on empty states', () => {
      const result = States.replaceState (undefined, {m: 10, n: 20});
      expect (result[0]).to.have.property ('m', 10);
      expect (result[0]).to.have.property ('n', 20);
    });
  });

  describe ('States.replaceStates()', () => {

    const state1 = {a: 1, b: 2};
    const state2 = {x: 1, y: 2};
    const state3 = {x: 1, y: 2, z: 3};

    it ('replaces states using multiple arguments', () => {
      const states = [state1, state2, state3];
      const result = States.replaceStates (states, {a: 10, b: 20}, {m: 30});
      expect (result[0]).to.have.property ('a', 10);
      expect (result[0]).to.have.property ('b', 20);
      expect (result[1]).to.equal (state2);
      expect (result[2]).to.equal (state3);
      expect (result[3]).to.have.property ('m', 30);
    });

    it ('replaces states using array argument', () => {
      const states = [state1, state2, state3];
      const result = States.replaceStates (states, [{a: 10, b: 20}, {m: 30}]);
      expect (result[0]).to.have.property ('a', 10);
      expect (result[0]).to.have.property ('b', 20);
      expect (result[1]).to.equal (state2);
      expect (result[2]).to.equal (state3);
      expect (result[3]).to.have.property ('m', 30);
    });
  });
});

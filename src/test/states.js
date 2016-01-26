'use strict';

import {expect} from 'mai-chai';
import {FieldStates} from '../index.js';

describe ('FieldStates', () => {
  describe ('FieldStates.fingerprint()', () => {
    it ('empty state produces empty fingerprint', () => {
      expect (FieldStates.fingerprint ({})).to.equal ('');
      expect (FieldStates.fingerprint ({id: 1})).to.equal ('');
    });

    it ('similar state produces same fingerprint', () => {
      expect (FieldStates.fingerprint ({a: 1, b: 2})).to.equal ('a,b');
      expect (FieldStates.fingerprint ({b: 1, a: 2})).to.equal ('a,b');
    });
  });

  describe ('find()', () => {

    const state1 = {a: 1, b: 2};
    const state2 = {x: 1, y: 2};
    const state3 = {x: 1, y: 2, z: 3};

    const states = FieldStates.from (state1, state2, state3);

    it ('finds state based on fingerprint', () => {
      expect (states.find ('a,b')).to.deep.equal (state1);
      expect (states.find ('x,y')).to.deep.equal (state2);
      expect (states.find ('x,y,z')).to.deep.equal (state3);
    });

    it ('returns null on mismatch', () => {
      expect (states.find ('b,a')).to.not.exist ();
      expect (states.find ('x')).to.not.exist ();
    });
  });

  describe ('add()', () => {

    const state1 = {a: 1, b: 2};
    const state2 = {x: 1, y: 2};
    const state3 = {x: 1, y: 2, z: 3};

    const states = FieldStates.from (state1, state2, state3);

    it ('replaces state based on fingerprint', () => {
      const result = states.add ({a: 10, b: 20}).get ();
      expect (result[0]).to.have.property ('a', 10);
      expect (result[0]).to.have.property ('b', 20);
      expect (result[1]).to.deep.equal (state2);
      expect (result[2]).to.deep.equal (state3);
    });

    it ('adds new state if it does not exist', () => {
      const result = states.add ({m: 10, n: 20}).get ();
      expect (result[0]).to.deep.equal (state1);
      expect (result[1]).to.deep.equal (state2);
      expect (result[2]).to.deep.equal (state3);
      expect (result[3]).to.have.property ('m', 10);
      expect (result[3]).to.have.property ('n', 20);
    });

    it ('adds new state on empty states', () => {
      const states = FieldStates.create ();
      const result = states.add ({m: 10, n: 20}).get ();
      expect (result[0]).to.have.property ('m', 10);
      expect (result[0]).to.have.property ('n', 20);
    });

    it ('replaces states using multiple arguments', () => {
      const result = states.add ({a: 10, b: 20}, {m: 30}).get ();
      expect (result[0]).to.have.property ('a', 10);
      expect (result[0]).to.have.property ('b', 20);
      expect (result[1]).to.deep.equal (state2);
      expect (result[2]).to.deep.equal (state3);
      expect (result[3]).to.have.property ('m', 30);
    });
  });
});

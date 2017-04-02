/* global describe it beforeEach */

import {expect} from 'mai-chai';
import {Middleware} from '../src/middleware.js';

/******************************************************************************/

describe ('Middleware', () => {

  const middleware = new Middleware ();

  beforeEach (() => middleware.reset ());

  describe ('register()', () => {
    it ('registers a named middleware', () => {
      middleware.register ('foo');
      expect (middleware.list ()).to.deep.equal ([ 'foo' ]);
    });

    it ('throws if a middleware is registered twice', () => {
      middleware.register ('foo');
      expect (() => middleware.register ('foo')).to.throw (Error);
    });
  });

  describe ('unregister()', () => {
    it ('unregisters a registered middleware', () => {
      const m = {};
      middleware.register ('foo', m);
      expect (middleware.unregister ('foo')).to.equal (m);
      expect (middleware.list ()).to.deep.equal ([]);
    });

    it ('does nothing for an unregistered middleware', () => {
      expect (middleware.unregister ('foo')).to.be.undefined ();
      expect (middleware.list ()).to.deep.equal ([]);
    });
  });
});

/******************************************************************************/

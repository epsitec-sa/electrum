'use strict';

import {expect} from 'mai-chai';
import {Store} from 'electrum-store';
import {Theme} from 'electrum-theme';
import Middleware from '../middleware.js';

describe ('Store', () => {
  describe ('Store.link()', () => {
    it ('produces properties linked to child state', () => {
      const store = Store.create ('x');
      store.select ('a.b.c');
      const props1 = {state: store.find ('a')};
      const props2 = Store.link (props1, 'b');
      expect (props1.state).to.equal (store.find ('a'));
      expect (props2.state).to.equal (store.find ('a.b'));
    });

    it ('produces properties without unrelated stuff', () => {
      const store = Store.create ('x');
      store.select ('a.b.c');
      const props1 = {state: store.find ('a'), foo: 'bar'};
      const props2 = Store.link (props1, 'b');
      expect (props1).to.have.property ('state');
      expect (props1).to.have.property ('foo');
      expect (props2).to.have.property ('state');
      expect (props2).to.not.have.property ('foo');
    });

    it ('produces properties which propagate the theme', () => {
      const store = Store.create ('x');
      const theme = Theme.create ('default');
      store.select ('a.b.c');
      const props1 = {state: store.find ('a'), theme: theme};
      const props2 = Store.link (props1, 'b');
      expect (props1.theme).to.equal (theme);
      expect (props2.theme).to.equal (theme);
    });

    it ('allows for the theme to be overridden', () => {
      const store = Store.create ('x');
      const theme1 = Theme.create ('default');
      const theme2 = Theme.create ('default');
      store.select ('a.b.c');
      const props1 = {state: store.find ('a'), theme: theme1};
      const props2 = Store.link (props1, 'b', {theme: theme2});
      expect (props1.theme).to.equal (theme1);
      expect (props2.theme).to.equal (theme2);
    });
  });

  describe ('Store.link() using Middleware', () => {
    it ('produces properties linked to child state', () => {
      const store = Store.create ('x');
      const middleware = new Middleware ();
      middleware.register ('state', (id, prop) => prop.select (id));
      store.select ('a.b.c');
      const props1 = {state: store.find ('a')};
      const props2 = middleware.link (props1, 'b');
      expect (props1.state).to.equal (store.find ('a'));
      expect (props2.state).to.equal (store.find ('a.b'));
    });

    it ('produces properties without unrelated stuff', () => {
      const store = Store.create ('x');
      const middleware = new Middleware ();
      middleware.register ('state', (id, prop) => prop.select (id));
      store.select ('a.b.c');
      const props1 = {state: store.find ('a'), foo: 'bar'};
      const props2 = middleware.link (props1, 'b');
      expect (props1).to.have.property ('state');
      expect (props1).to.have.property ('foo');
      expect (props2).to.have.property ('state');
      expect (props2).to.not.have.property ('foo');
    });

    it ('produces properties which propagate the theme', () => {
      const store = Store.create ('x');
      const middleware = new Middleware ();
      middleware.register ('state', (id, prop) => prop.select (id));
      middleware.register ('theme');
      const theme = Theme.create ('default');
      store.select ('a.b.c');
      const props1 = {state: store.find ('a'), theme: theme};
      const props2 = middleware.link (props1, 'b');
      expect (props1.theme).to.equal (theme);
      expect (props2.theme).to.equal (theme);
    });

    it ('allows for the theme to be overridden', () => {
      const store = Store.create ('x');
      const middleware = new Middleware ();
      middleware.register ('state', (id, prop) => prop.select (id));
      middleware.register ('theme');
      const theme1 = Theme.create ('default');
      const theme2 = Theme.create ('default');
      store.select ('a.b.c');
      const props1 = {state: store.find ('a'), theme: theme1};
      const props2 = middleware.link (props1, 'b', {theme: theme2});
      expect (props1.theme).to.equal (theme1);
      expect (props2.theme).to.equal (theme2);
    });
  });
});

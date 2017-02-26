/* global describe it */

import {expect} from 'mai-chai';
import {Store} from 'electrum-store';
import {Theme} from 'electrum-theme';

import Electrum from 'electrum';


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

  describe ('Electrum.link() using LinkingMiddleware', () => {
    it ('produces properties linked to child state', () => {
      const store = Store.create ('x');
      store.select ('a.b.c');
      const props1 = {state: store.find ('a')};
      const props2 = Electrum.link (props1, 'b');
      expect (props1.state).to.equal (store.find ('a'));
      expect (props2.state).to.equal (store.find ('a.b'));
    });

    it ('produces properties without unrelated stuff', () => {
      const store = Store.create ('x');
      store.select ('a.b.c');
      const props1 = {state: store.find ('a'), foo: 'bar'};
      const props2 = Electrum.link (props1, 'b');
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
      const props2 = Electrum.link (props1, 'b');
      expect (props1.theme).to.equal (theme);
      expect (props2.theme).to.equal (theme);
    });

    it ('allows for the theme to be overridden', () => {
      const store = Store.create ('x');
      const theme1 = Theme.create ('default');
      const theme2 = Theme.create ('default');
      store.select ('a.b.c');
      const props1 = {state: store.find ('a'), theme: theme1};
      const props2 = Electrum.link (props1, 'b', {theme: theme2});
      expect (props1.theme).to.equal (theme1);
      expect (props2.theme).to.equal (theme2);
    });

    it ('produces properties including "inject:.." properties', () => {
      const store = Store.create ('x');
      const theme = Theme.create ('default');
      store.select ('a.b.c');
      const props1 = {state: store.find ('a'), theme: theme, 'inject:x': 'X', 'inject:y': 'Y'};
      const props2 = Electrum.link (props1, 'b', {'inject:x': '?'});
      expect (props1.theme).to.equal (theme);
      expect (props2.theme).to.equal (theme);
      expect (props2).to.have.property ('inject:x', '?');
      expect (props2).to.have.property ('inject:y', 'Y');
    });
  });
});

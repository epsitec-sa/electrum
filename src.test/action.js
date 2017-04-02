/* global describe it */

import {expect} from 'mai-chai';
import {Action, Store} from 'electrum';

describe ('Action', () => {
  describe ('isEnabled()', () => {
    it ('returns true when enabled', () => {
      const store = Store.create ();
      const state = store.select ('foo').set ({status: 'enabled'});
      expect (Action.isEnabled (state)).to.be.true ();
    });
    it ('returns false when not enabled', () => {
      const store = Store.create ();
      const state = store.select ('foo').set ({status: 'x'});
      expect (Action.isEnabled (state)).to.be.false ();
    });
  });

  describe ('isDisabled()', () => {
    it ('returns true when disabled', () => {
      const store = Store.create ();
      const state = store.select ('foo').set ({status: 'disabled'});
      expect (Action.isDisabled (state)).to.be.true ();
    });

    it ('returns false when not disabled', () => {
      const store = Store.create ();
      const state = store.select ('foo').set ({status: 'x'});
      expect (Action.isDisabled (state)).to.be.false ();
    });

    it ('returns false for empty state', () => {
      const store = Store.create ();
      const state = store.select ('foo');
      expect (Action.isDisabled (state)).to.be.false ();
    });

    it ('returns false when no state is provided', () => {
      Store.create ();
      expect (Action.isDisabled ()).to.be.false ();
    });
  });
});

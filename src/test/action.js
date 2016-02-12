'use strict';

import {expect} from 'mai-chai';
import {Action, Store} from 'electrum';

describe ('Action', () => {
  describe ('isEnabled()', () => {
    it ('returns true when enabled', () => {
      const store = Store.create ();
      const state = store.select ('foo').set ({status: 'enabled'});
      expect (Action.isEnabled (state)).to.be.true ();
    });
    describe ('isEnabled()', () => {
      it ('returns false when not enabled', () => {
        const store = Store.create ();
        const state = store.select ('foo').set ({status: 'x'});
        expect (Action.isEnabled (state)).to.be.false ();
      });
    });
  });

  describe ('isDisabled()', () => {
    it ('returns true when disabled', () => {
      const store = Store.create ();
      const state = store.select ('foo').set ({status: 'disabled'});
      expect (Action.isDisabled (state)).to.be.true ();
    });
    describe ('isDisabled()', () => {
      it ('returns false when not disabled', () => {
        const store = Store.create ();
        const state = store.select ('foo').set ({status: 'x'});
        expect (Action.isDisabled (state)).to.be.false ();
      });
    });
  });
});

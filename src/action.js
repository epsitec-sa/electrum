'use strict';

function read (state, prop) {
  if (state) {
    const value = state.get ();
    if (value) {
      return value[prop];
    }
  }
}

export default class Action {
  static isEnabled (state) {
    switch (read (state, 'status')) {
      case 'Enabled':
      case 'enabled':
        return true;
      default:
        return false;
    }
  }

  static isDisabled (state) {
    switch (read (state, 'status')) {
      case 'Disabled':
      case 'disabled':
        return true;
      default:
        return false;
    }
  }
}

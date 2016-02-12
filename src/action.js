'use strict';

export default class Action {
  static isEnabled (state) {
    switch (state.get ().status) {
      case 'Enabled':
      case 'enabled':
        return true;
      default:
        return false;
    }
  }

  static isDisabled (state) {
    switch (state.get ().status) {
      case 'Disabled':
      case 'disabled':
        return true;
      default:
        return false;
    }
  }
}

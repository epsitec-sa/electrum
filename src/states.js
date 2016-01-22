'use strict';

/******************************************************************************/

export default class States {

  static fingerprint (state) {
    var keys = Object.keys (state);
    return keys.filter (k => k !== 'id')
               .sort ()
               .join ();
  }

  static findState (states, match) {
    if (states) {
      for (let i = 0; i < states.length; i++) {
        const state = states[i];
        const what  = States.fingerprint (state);
        if (what === match) {
          return state;
        }
      }
    }
    return null;
  }

  static replaceState (states, newState) {
    if (newState) {
      if (states) {
        var what = States.fingerprint (newState);
        for (let i = 0; i < states.length; i++) {
          if (States.fingerprint (states[i]) === what) {
            states[i] = newState;
            return states;
          }
        }
        states.push (newState);
      } else {
        states = [newState];
      }
    }
    return states;
  }

  static replaceStates (states, ...newStates) {
    if (newStates.length > 0) {
      for (let i = 0; i < newStates.length; i++) {
        if (Array.isArray (newStates[i])) {
          states = States.replaceStates (states, ...newStates[i]);
        } else {
          states = States.replaceState (states, newStates[i]);
        }
      }
    }
    return states;
  }
}

/******************************************************************************/

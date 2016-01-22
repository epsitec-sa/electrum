'use strict';

import radium from 'radium';

import LinkingMiddleware from './linking-middleware.js';
import Electrum from './electrum.js';
import States from './states.js';

/******************************************************************************/

class RadiumConnector {
  static wrap (component) {
    return radium (component);
  }
}

/******************************************************************************/

export default new Electrum (RadiumConnector);
export {Electrum, LinkingMiddleware, States};

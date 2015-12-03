'use strict';

import radium from 'radium';

import Middleware from './middleware.js';
import Electrum from './electrum.js';

/******************************************************************************/

class RadiumConnector {
  static wrap (component) {
    return radium (component);
  }
}

/******************************************************************************/

export default new Electrum (RadiumConnector);
export {Electrum, Middleware};

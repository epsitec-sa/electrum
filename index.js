'use strict';

/*****************************************************************************/

function Electrum () {
  if (!(this instanceof Electrum)) {
    var obj = Object.create (Electrum.prototype);
    obj.constructor.apply (obj, arguments);
    return obj;
  }

  this.connectors = [];
  this.bus = {};

  for (var i = 0; i < arguments.length; i++) {
    this.use (arguments[i]);
  }
}

/*****************************************************************************/

import use from './modules/use.js';
import createClass from './modules/create-class.js';

Electrum.prototype.use = use;
Electrum.prototype.createClass = createClass;

/*****************************************************************************/

export default Electrum;

/*****************************************************************************/

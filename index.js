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

Electrum.prototype.use = require ('./modules/use.js');
Electrum.prototype.createClass = require ('./modules/create-class.js');

/*****************************************************************************/

module.exports = Electrum;

/*****************************************************************************/

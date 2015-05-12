'use strict';

var check = require ('./check.js');

/*****************************************************************************/

module.exports = function (connector) {
  var api;
  var bus;

  check.verifyMethod (connector, 'wrap', 'connector');

  if (check.hasMethod (connector, 'getElectrumApi')) {
    api = connector.getElectrumApi ();
    check.verifyInterface (api, require ('./interfaces/api.js'));
  }

  if (check.hasMethod (connector, 'getElectrumBus')) {
    bus = connector.getElectrumBus ();
    check.verifyInterface (bus, require ('./interfaces/bus.js'));
  }

  // Everything was successfully verified; we can now proceed and alter
  // this Electrum instance:

  this.connectors.unshift (connector);

  if (api) {
    Object.keys (api).forEach (key => this[key] = api[key]);
  }
  if (bus) {
    Object.keys (bus).forEach (key => this.bus[key] = bus[key]);
  }

  return this;
};

/*****************************************************************************/

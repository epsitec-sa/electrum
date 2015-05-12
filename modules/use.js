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

  this.connectors.unshift (connector);
  return this;
};

/*****************************************************************************/

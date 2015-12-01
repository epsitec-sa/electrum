'use strict';

import { verifyMethod, verifyInterface, hasMethod }
  from './utils/check.js';

import * as IApi from './interfaces/api.js';
import * as IBus from './interfaces/bus.js';

/*****************************************************************************/

export default function (connector) {
  var api;
  var bus;

  verifyMethod (connector, 'wrap', 'connector');

  if (hasMethod (connector, 'getElectrumApi')) {
    api = connector.getElectrumApi ();
    verifyInterface (api, IApi);
  }

  if (hasMethod (connector, 'getElectrumBus')) {
    bus = connector.getElectrumBus ();
    verifyInterface (bus, IBus);
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
}

/*****************************************************************************/

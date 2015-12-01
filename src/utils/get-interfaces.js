'use strict';

import { verifyMethod, verifyInterface, hasMethod }
  from './check.js';

import IApi from '../interfaces/api.js';
import IBus from '../interfaces/bus.js';

/******************************************************************************/

export function getApi (connector) {
  if (hasMethod (connector, 'getElectrumApi')) {
    const api = connector.getElectrumApi ();
    verifyInterface (api, IApi);
    return api;
  }
  return null;
}

export function getBus (connector) {
  if (hasMethod (connector, 'getElectrumBus')) {
    const bus = connector.getElectrumBus ();
    verifyInterface (bus, IBus);
    return bus;
  }
  return null;
}

export function verifyWrap (connector) {
  verifyMethod (connector, 'wrap', 'connector', 1);
}

/******************************************************************************/

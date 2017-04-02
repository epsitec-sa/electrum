/******************************************************************************/

import {verifyMethod, verifyInterface, hasMethod} from './checks.js';

import {IBus} from '../interfaces/bus.js';

/******************************************************************************/

export function getBus (connector) {
  if (hasMethod (connector, 'getElectrumBus')) {
    const bus = connector.getElectrumBus ();
    verifyInterface (bus, IBus);
    return bus;
  }
  return null;
}

export function getWrap (connector) {
  if (hasMethod (connector, 'wrap')) {
    verifyMethod (connector, 'wrap', 'connector', 1);
    return connector.wrap;
  }
  return null;
}

export function verifyWrap (connector) {
  verifyMethod (connector, 'wrap', 'connector', 1);
}

/******************************************************************************/

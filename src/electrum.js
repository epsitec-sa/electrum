'use strict';

import Middleware from './middleware.js';
import {getApi, getBus, verifyWrap} from './utils/get-interfaces.js';
import extend from './utils/extend.js';
import wrap from './utils/wrap.js';

/******************************************************************************/

export default class Electrum {
  constructor (...wrappers) {
    this._connectors = [];
    this._bus = {};
    this._middleware = new Middleware ();
    this._middleware.register ('state', (id, state) => state.select (id));
    this._middleware.register ('theme', (id, theme) => theme);
    wrappers.forEach (x => this.use (x));
  }

  use (connector) {
    verifyWrap (connector);

    const api = getApi (connector);
    const bus = getBus (connector);

    // Everything was successfully verified; we can now proceed and alter
    // the Electrum instance:
    this._connectors.unshift (connector);

    if (api) {
      Object.keys (api).forEach (key => this[key] = api[key]);
    }

    if (bus) {
      Object.keys (bus).forEach (key => this._bus[key] = bus[key]);
    }
  }

  link (props, id, override) {
    return this._middleware.link (props, id, override);
  }

  read (props, id) {
    const {state} = props;
    return state.get (id);
  }

  get middleware () {
    return this._middleware;
  }

  get connectors () {
    return this._connectors.slice ();
  }

  wrap (name, component, more) {
    const {styles} = more || {};
    return wrap (this._connectors, extend (name, component, styles));
  }
}

/*****************************************************************************/

'use strict';

import LinkingMiddleware from './linking-middleware.js';
import InjectingMiddleware from './injecting-middleware.js';
import {getApi, getBus, verifyWrap} from './utils/get-interfaces.js';
import extend from './utils/extend.js';
import wrap from './utils/wrap.js';

/******************************************************************************/

export default class Electrum {
  constructor (...wrappers) {
    this._connectors = [];
    this._bus = {};
    this._linkingMiddleware = new LinkingMiddleware ();
    this._linkingMiddleware.register ('state', (id, state) => state.select (id));
    this._linkingMiddleware.register ('theme', (id, theme) => theme);
    this._injectingMiddleware = new InjectingMiddleware ();
    this._injectingMiddleware.register ('events', (obj, props) => {});
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

  inject (obj, props) {
    this._injectingMiddleware.inject (obj, props);
  }

  link (props, id, override) {
    return this._linkingMiddleware.link (props, id, override);
  }

  read (props, id) {
    const {state} = props;
    return state.get (id);
  }

  get middleware () {
    return this._linkingMiddleware;
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

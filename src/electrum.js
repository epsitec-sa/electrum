'use strict';

import {EventHandlers} from 'electrum-events';
import React from 'react';

import LinkingMiddleware from './linking-middleware.js';
import InjectingMiddleware from './injecting-middleware.js';
import {getBus, getWrap} from './utils/get-interfaces.js';
import extend from './utils/extend.js';
import wrap from './utils/wrap.js';
import {getInstanceMethodNames} from './utils/checks.js';

/******************************************************************************/

const emptyBus = {};

const codeA = 'A'.charCodeAt (0);
const codeZ = 'Z'.charCodeAt (0);

function shouldAutoBind (name) {
  if (name.length > 2 && name.startsWith ('on')) {
    const code = name.charCodeAt (2);
    return (code >= codeA && code <= codeZ);
  }
  if (name.length > 6 && name.startsWith ('handle')) {
    const code = name.charCodeAt (6);
    return (code >= codeA && code <= codeZ);
  }
  return false;
}

/******************************************************************************/

export default class Electrum {
  constructor (...wrappers) {
    this._wrappers = wrappers;
    this.reset ();
  }

  get bus () {
    return this._bus;
  }

  reset () {
    this._connectors = [];
    this._bus = emptyBus;
    this._linkingMiddleware = new LinkingMiddleware ();
    this._linkingMiddleware.register ('state', (id, state) => id === undefined ? state : state.select (id));
    this._linkingMiddleware.register ('theme', (id, theme) => theme);
    this._linkingMiddleware.register ('inject:', (id, prop) => prop);
    this._injectingMiddleware = new InjectingMiddleware ();
    this._injectingMiddleware.register ('events', obj => {
      obj._eventHandlers = EventHandlers.inject (obj, () => this.bus);
    });
    this._wrappers.forEach (x => this.use (x));
    this._options = {};
  }

  use (connector) {
    const wrap = getWrap (connector);
    const bus  = getBus (connector);

    if (wrap) {
      this._connectors.unshift (connector);
    }

    if (bus) {
      this.useBus (bus);
    }
  }

  useBus (bus) {
    if (this._bus !== emptyBus) {
      throw new Error ('Electrum does not support using multiple buses');
    }
    this._bus = bus;
  }

  inject (obj) {
    this._injectingMiddleware.inject (obj);
  }

  autoBindHandlers (obj) {
    // Auto bind methods in the form of "onXyz" and "handleXyz" up the
    // class hierarchy.
    // Method render() may attach event handlers such as onClick directly
    // to this.onClick, without having to manually bind the method to the
    // instance using this.onClick.bind (this)

    const names = getInstanceMethodNames (obj, React.Component.prototype);

    names.forEach (name => {
      if (shouldAutoBind (name)) {
        obj[name] = obj[name].bind (obj);
      }
    });
  }

  link (props, id, override) {
    return this._linkingMiddleware.link (props, id, override);
  }

  read (props, id) {
    const {state} = props;
    return state.get (id || props.id);
  }

  get injectingMiddleware () {
    return this._injectingMiddleware;
  }

  get linkingMiddleware () {
    return this._linkingMiddleware;
  }

  get connectors () {
    return this._connectors.slice ();
  }

  configureLog (name, spy) {
    if (spy) {
      if (typeof spy !== 'function') {
        throw new Error ('The spy must be a function');
      }
      if (!this._options.log) {
        this._options.log = {};
      }
      this._options.log[name] = spy;
    } else {
      delete this._options.log[name];
    }
  }

  wrap (name, component, more) {
    const {styles} = more || {};
    return wrap (this._connectors, extend (name, component, styles, () => this._options));
  }
}

/******************************************************************************/

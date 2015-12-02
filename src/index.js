'use strict';

import React from 'react';
import Middleware from './middleware.js';
import {isSimpleFunction} from './utils/checks.js';
import {getApi, getBus, verifyWrap} from './utils/get-interfaces.js';
import markComponentAsPure from './utils/mark-component-as-pure.js';
import setComponentDisplayName from './utils/set-component-display-name.js';
import transformStatelessFunctionComponent from './utils/transform-stateless-function-component.js';
import wrap from './utils/wrap.js';

/******************************************************************************/

const middleware = new Middleware ();
middleware.register ('state', (id, prop) => prop.select (id));
middleware.register ('theme', (id, prop) => prop);

/******************************************************************************/

function config (name, component) {
  if (typeof component === 'function') {
    if (isSimpleFunction (component)) {
      if (component.length === 1) {
        component = transformStatelessFunctionComponent (component);
      } else {
        throw new Error (`Invalid stateless function component ${component.name}; it should take one parameter`);
      }
    }
    component = markComponentAsPure (component);
    component = setComponentDisplayName (component, name);
  }
  if (typeof component === 'object') {
    component = React.createClass (component);
    component = markComponentAsPure (component);
    component = setComponentDisplayName (component, name);
  }
  return component;
}

/******************************************************************************/

export class Electrum {
  constructor (...wrappers) {
    this.connectors = [];
    this.bus = {};
    wrappers.forEach (x => this.use (x));
  }

  use (connector) {
    verifyWrap (connector);

    const api = getApi (connector);
    const bus = getBus (connector);

    // Everything was successfully verified; we can now proceed and alter
    // the Electrum instance:
    this.connectors.unshift (connector);

    if (api) {
      Object.keys (api).forEach (key => this[key] = api[key]);
    }

    if (bus) {
      Object.keys (bus).forEach (key => this.bus[key] = bus[key]);
    }
  }

  link (props, id) {
    return middleware.link (props, id);
  }

  get middleware () {
    return middleware;
  }

  wrap (name, component) {
    return wrap (this.connectors, config (name, component));
  }
}

/******************************************************************************/

const e = new Electrum ();

export default e;

/*****************************************************************************/

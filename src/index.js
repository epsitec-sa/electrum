'use strict';

import React from 'react';
import Middleware from './middleware.js';
import {getApi, getBus, verifyWrap} from './utils/get-interfaces.js';
import wrap from './utils/wrap.js';
import shallowCompare from 'react-addons-shallow-compare';

/******************************************************************************/

const middleware = new Middleware ();
middleware.register ('state', (id, prop) => prop.select (id));
middleware.register ('theme', (id, prop) => prop);

/******************************************************************************/

function configStatelessFunctionComponent (name, render) {
  return React.createClass ({
    shouldComponentUpdate: function (nextProps, nextState) {
      return shallowCompare (this, nextProps, nextState);
    },
    render: function () {
      return render (this.props);
    },
    displayName: name
  });
}

function config (name, component) {
  if (typeof component === 'function') {
    if (component.length === 1) {
      return configStatelessFunctionComponent (name, component);
    } else {
      throw new Error ('Invalid stateless function component; function should take one parameter');
    }
  }
  if (typeof component === 'object') {
    component.displayName = name;
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

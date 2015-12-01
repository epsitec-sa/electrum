'use strict';

import React from 'react';
import Middleware from './middleware.js';
import shallowCompare from 'react-addons-shallow-compare';

/*****************************************************************************/

function Electrum () {
  if (!(this instanceof Electrum)) {
    var obj = Object.create (Electrum.prototype);
    obj.constructor.apply (obj, arguments);
    return obj;
  }

  this.connectors = [];
  this.bus = {};

  for (var i = 0; i < arguments.length; i++) {
    this.use (arguments[i]);
  }
}

/*****************************************************************************/

import use from './use.js';
import createClass from './create-class.js';

Electrum.prototype.use = use;
Electrum.prototype.createClass = createClass;

const middleware = new Middleware ();
middleware.register ('state', (id, prop) => prop.select (id));
middleware.register ('theme', (id, prop) => prop);

Electrum.middleware = middleware;

/*****************************************************************************/

export default Electrum;
export const E = new Electrum ();

function link (props, id) {
  return middleware.link (props, id);
}

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
  return component;
}

E.wrapComponent = config;
E.link = link;
E.shallowCompare = shallowCompare;

/*****************************************************************************/

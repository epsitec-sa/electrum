'use strict';

import React from 'react';

/*****************************************************************************/

var wrap = function (wrappers, obj) {
  wrappers.forEach (function (wrapper) {
    obj = wrapper.wrap (obj);
  });
  return obj;
};

/*****************************************************************************/

export default function createClass (...args) {
  var component;
  switch (args.length) {
    case 1:
      component = args[0];
      break;
    case 2:
      if ((typeof args[0] === 'string') &&
          (typeof args[1] === 'object')) {
        component = args[1];
        component.displayName = args[0];
      }
      break;
  }
  if (component) {
    return React.createClass (wrap (this.connectors, component));
  } else {
    throw new Error ('Invalid arguments provided to Electrum.createClass().');
  }
}

/*****************************************************************************/

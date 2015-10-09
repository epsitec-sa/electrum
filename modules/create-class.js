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

module.exports = function () {
  var component;
  switch (arguments.length) {
    case 1:
      component = arguments[0];
      break;
    case 2:
      if ((typeof arguments[0] === 'string') &&
          (typeof arguments[1] === 'object')) {
        component = arguments[1];
        component.displayName = arguments[0];
      }
      break;
  }
  if (component) {
    return React.createClass (wrap (this.connectors, component));
  } else {
    throw 'Invalid arguments provided to Electrum.createClass.';
  }
};

/*****************************************************************************/

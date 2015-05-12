'use strict';

var React = require ('react');

/*****************************************************************************/

var wrap = function (wrappers, obj) {
  wrappers.forEach (function (wrapper) {
    obj = wrapper.wrap (obj);
  });
  return obj;
};

/*****************************************************************************/

module.exports = function (reactComponent) {
  return React.createClass (wrap (this.connectors, reactComponent));
};

/*****************************************************************************/

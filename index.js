'use strict';

var React = require ('react');

/*****************************************************************************/

function Electrum () {
  if (!(this instanceof Electrum)) {
    var obj = Object.create (Electrum.prototype);
    obj.constructor.apply (obj, arguments);
    return obj;
  }
  this.connectors = [];
  for (var i = 0; i < arguments.length; i++) {
    this.use (arguments[i]);
  }
}

/*****************************************************************************/

Electrum.prototype.use = function (connector) {
  if (!connector.hasOwnProperty ('wrap')) {
    throw 'The provided connector does not implement a wrap function.';
  }

  if (typeof (connector.wrap) !== 'function') {
    throw 'The provided connector provides wrap, but it is not a function.';
  }

  this.connectors.unshift (connector);
  return this;
};

/*****************************************************************************/

var wrap = function (wrappers, obj) {
  wrappers.forEach (function (wrapper) {
    obj = wrapper.wrap (obj);
  });
  return obj;
};

Electrum.prototype.createClass = function (reactComponent) {
  return React.createClass (wrap (this.connectors, reactComponent));
};

/*****************************************************************************/

module.exports = Electrum;

/*****************************************************************************/

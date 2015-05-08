'use strict';
var React      = require ('react');

/*****************************************************************************/

function Electrum () {
  this.connectors = [];
}

Electrum.prototype.use = function (connector) {

  if (!connector.hasOwnProperty ('wrap')) {
    throw 'Your connector must implement a wrap function';
  }

  if (typeof (connector.wrap) !== 'function') {
    throw 'You must provide a function';
  }

  this.connectors.unshift (connector);
  return this;
};

Electrum.prototype.createClass = function (reactComponent) {
  this.connectors.forEach (function (connector) {
    reactComponent = connector.wrap (reactComponent);
  });
  return React.createClass (reactComponent);
};

/*****************************************************************************/
// Generate Electrum API with Auto-instanciation on call

var call = function (call, args) {
  if (!(this instanceof Electrum) && call !== 'create') {
    throw 'You must call create before using';
  }
  return this[call].apply (this, args);
};

Object.keys (Electrum.prototype).forEach (function (fct) {
  console.log (fct);
  module.exports[fct] = function () {
    var args = Array.prototype.slice.call (arguments);
    return call (fct, args);
  };
});

// Factory
module.exports.create = function () {
  if (!(this instanceof Electrum)) {
    return new Electrum ();
  }
  return this;
};

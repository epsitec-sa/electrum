'use strict';

var check = require ('./check.js');

/*****************************************************************************/

module.exports = function (connector) {

  check.verifyMethod (connector, 'wrap', 'connector');

  this.connectors.unshift (connector);
  return this;
};

/*****************************************************************************/

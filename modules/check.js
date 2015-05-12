'use strict';

/*****************************************************************************/

var verifyMethod = function verifyMethod (obj, method, what) {
  what = what || 'interface';
  if (!obj.hasOwnProperty (method)) {
    throw 'The provided '+what+' does not implement method '+method+'.';
  }

  if (typeof (obj[method]) !== 'function') {
    throw 'The provided '+what+' contains '+method+', but it is not a function.';
  }
};

/*****************************************************************************/

var verifyInterface = function verifyInterface (obj, ...methods) {
  methods.forEach (m => verifyMethod (obj, m));
};

/*****************************************************************************/

module.exports = {
  verifyMethod: verifyMethod,
  verifyInterface: verifyInterface,
};

/*****************************************************************************/

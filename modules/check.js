'use strict';

/*****************************************************************************/

var hasMethod = function hasMethod (obj, method) {
  return obj.hasOwnProperty (method) && typeof obj[method] === 'function';
};

/*****************************************************************************/

var hasInterface = function hasInterface (obj, ...methods) {
  for (var i = 0; i < methods.length; i++) {
    if (!hasMethod (obj, methods[i])) {
      return false;
    }
  }
  return true;
};

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
  hasMethod: hasMethod,
  hasInterface: hasInterface,
  verifyMethod: verifyMethod,
  verifyInterface: verifyInterface,
};

/*****************************************************************************/

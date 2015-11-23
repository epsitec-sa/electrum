'use strict'; /*jshint latedef:false*/

/*****************************************************************************/

export function hasMethod (obj, method) {
  return obj.hasOwnProperty (method) && typeof obj[method] === 'function';
}

/*****************************************************************************/

export function hasInterface (obj, ...methods) {
  for (var i = 0; i < methods.length; i++) {
    if (!hasMethod (obj, methods[i])) {
      return false;
    }
  }
  return true;
}

/*****************************************************************************/

export function verifyMethod (obj, method, what) {
  what = what || 'interface';
  if (!obj.hasOwnProperty (method)) {
    throw 'The provided ' + what + ' does not implement method ' + method + '.';
  }
  if (typeof (obj[method]) !== 'function') {
    throw 'The provided ' + what + ' contains ' + method + ', but it is not a function.';
  }
}

/*****************************************************************************/

var verifyMethodOrInterface = function verifyMethodOrInterface (obj, match) {
  if (typeof match === 'string') {
    return verifyMethod (obj, match);
  }
  if (typeof match === 'object') {
    var methods = Object.keys (match);
    methods.forEach (function (m) {
      if (typeof match[m] !== 'function') {
        throw 'Invalid interface specified: ' + m + ' is not a function.';
      }
    });
    return verifyInterface (obj, ...methods);
  }
  throw 'Invalid interface specified: no idea what to do with ' + match + '.';
};

/*****************************************************************************/

export function verifyInterface (obj, ...methods) {
  if (methods.length === 0) {
    throw 'Empty interface specified.';
  }
  methods.forEach (m => verifyMethodOrInterface (obj, m));
}

/*****************************************************************************/

'use strict'; /*jshint latedef:false*/

/******************************************************************************/

export function hasMethod (obj, method) {
  return typeof obj[method] === 'function';
}

export function isClass (obj) {
  // See http://stackoverflow.com/questions/29093396/how-do-you-check-the-difference-between-an-ecmascript-6-class-and-function
  // For now, there is no way to identify a class for sure.
  if (typeof obj !== 'function') {
    return false;
  }
  const dump = obj + '';
  if (dump.startsWith ('class ')) { // that sould be expected from an ES6-compilant engine
    return true;
  }
  if (dump.includes (', _classCallCheck(')) { // this is what Babel 6.x produces
    return true;
  }
  return false;
}

/******************************************************************************/

export function hasInterface (obj, ...methods) {
  for (let method of methods) {
    if (!hasMethod (obj, method)) {
      return false;
    }
  }
  return true;
}

/******************************************************************************/

export function verifyMethod (obj, method, what, n) {
  what = what || 'interface';
  let target = obj[method];
  if (target === undefined) {
    throw new Error (`The provided ${what} does not implement method ${method}`);
  }
  if (typeof target !== 'function') {
    throw new Error (`The provided ${what} contains ${method}, but it is not a function`);
  }
  if ((n !== undefined) &&
      (n !== target.length)) {
    throw new Error (`The provided ${what} contains ${method}, but it does not take ${n} arguments`);
  }
}

/******************************************************************************/

function verifyMethodOrInterface (obj, match) {
  if (typeof match === 'string') {
    return verifyMethod (obj, match);
  }
  if (typeof match === 'object') {
    var methods = Object.keys (match);
    for (let method of methods) {
      if (typeof match[method] !== 'function') {
        throw new Error (`Invalid interface specified: ${method} is not a function`);
      }
    }
    return verifyInterface (obj, ...methods);
  }
  throw new Error (`Invalid interface specified: no idea what to do with ${match}`);
}

/******************************************************************************/

export function verifyInterface (obj, ...methods) {
  if (methods.length === 0) {
    throw new Error (`Empty interface specified`);
  }
  for (let method of methods) {
    verifyMethodOrInterface (obj, method);
  }
}

/******************************************************************************/

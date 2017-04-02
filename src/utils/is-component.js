/******************************************************************************/

export function isComponent (func) {
  return (
      typeof (func) === 'function' &&
      typeof (func.prototype) === 'object' &&
      typeof (func.prototype.render) === 'function'
  );
}

/******************************************************************************/

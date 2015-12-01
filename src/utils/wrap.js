'use strict';

/******************************************************************************/

export default function wrap (wrappers, obj) {
  wrappers.forEach (function (wrapper) {
    obj = wrapper.wrap (obj);
  });
  return obj;
}

/******************************************************************************/

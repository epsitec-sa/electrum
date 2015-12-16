'use strict';

import Middleware from './middleware.js';

/*****************************************************************************/

function linkProperty (copy, props, overrides, middleware, id, name) {
  let prop = props[name];
  if (overrides.hasOwnProperty (name)) {
    prop = overrides[name];
  }
  if (middleware) {
    if (prop !== undefined) {
      prop = middleware (id, prop);
    }
  }
  if (prop === undefined) {
    delete copy[name];
  } else {
    copy[name] = prop;
  }
}

/*****************************************************************************/

export default class LinkingMiddleware extends Middleware {
  link (props, id, overrides = {}) {
    let copy = {};
    for (let item of this._middlewares) {
      const name = item.name;
      const middleware = item.middleware;
      if (name.endsWith (':')) {
        const n1 = Object.getOwnPropertyNames (props).filter (x => x.startsWith (name));
        const n2 = Object.getOwnPropertyNames (overrides).filter (x => x.startsWith (name));
        const names = new Set (n1.concat (n2));
        names.forEach (name => linkProperty (copy, props, overrides, middleware, id, name));
      } else {
        linkProperty (copy, props, overrides, middleware, id, name);
      }
    }
    return copy;
  }
}

/*****************************************************************************/

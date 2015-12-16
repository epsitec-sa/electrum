'use strict';

import Middleware from './middleware.js';

/*****************************************************************************/

function linkProperty (copy, props, overrides, middleware, id, name) {
  let prop = props[name];
  if (overrides) {
    let override = overrides[name];
    if (override) {
      prop = override;
    }
  }
  if (middleware) {
    if (prop !== undefined) {
      prop = middleware (id, prop);
    }
  }
  if (prop !== undefined) {
    copy[name] = prop;
  }
}

/*****************************************************************************/

export default class LinkingMiddleware extends Middleware {
  link (props, id, overrides) {
    let copy = {};
    for (let item of this._middlewares) {
      const name = item.name;
      const middleware = item.middleware;
      if (name.endsWith (':')) {
        Object.getOwnPropertyNames (props)
          .filter (x => x.startsWith (name))
          .forEach (name => linkProperty (copy, props, overrides, middleware, id, name));
      } else {
        linkProperty (copy, props, overrides, middleware, id, name);
      }
    }
    return copy;
  }
}

/*****************************************************************************/

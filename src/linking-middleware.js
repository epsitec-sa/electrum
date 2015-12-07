'use strict';

import Middleware from './middleware.js';

/*****************************************************************************/

export default class LinkingMiddleware extends Middleware {
  link (props, id, overrides) {
    let copy = {};
    for (let item of this._middlewares) {
      const name = item.name;
      const middleware = item.middleware;
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
    return copy;
  }
}

/*****************************************************************************/

'use strict';

import Middleware from './middleware.js';

/*****************************************************************************/

export default class InjectingMiddleware extends Middleware {
  inject (obj) {
    for (let item of this._middlewares) {
      const middleware = item.middleware;
      if (middleware) {
        middleware (obj);
      }
    }
  }
}

/*****************************************************************************/

import {Middleware} from './middleware.js';

/*****************************************************************************/

export class InjectingMiddleware extends Middleware {
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

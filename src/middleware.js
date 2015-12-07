'use strict';

/*****************************************************************************/

export default class Middleware {
  constructor () {
    this._middlewares = [];
  }

  reset () {
    this._middlewares = [];
  }

  register (name, middleware) {
    if (this._middlewares.findIndex (x => x.name === name) >= 0) {
      throw new Error (`Middleware ${name} cannot be registered twice`);
    }
    this._middlewares.push ({name, middleware});
  }

  list () {
    return this._middlewares.map (x => x.name);
  }

  unregister (name) {
    const pos = this._middlewares.findIndex (x => x.name === name);
    if (pos >= 0) {
      const item = this._middlewares.splice (pos, 1)[0];
      return item.middleware;
    } else {
      return undefined;
    }
  }
}

/*****************************************************************************/

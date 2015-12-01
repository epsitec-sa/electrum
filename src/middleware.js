'use strict';

export default class Middleware {
  constructor () {
    this._middlewares = [];
  }

  reset () {
    this._middlewares = [];
  }

  register (name, middleware) {
    if (this._middlewares.findIndex (x => x.name === name) >= 0) {
      throw new Error ('Middleware cannot be registered twice');
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
        prop = middleware (id, prop);
      }
      if (prop !== undefined) {
        copy[name] = prop;
      }
    }
    return copy;
  }
}

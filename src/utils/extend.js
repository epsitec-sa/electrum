'use strict';

import extendComponent from './extend-component.js';
import extendComponentDisplayName from './extend-component-display-name.js';
import isStatelessFunctionComponent from './is-stateless-function-component.js';
import transformStatelessFunctionComponent from './transform-stateless-function-component.js';

/******************************************************************************/

export default function extend (name, component, stylesDef, optionsGetter) {
  if (typeof component !== 'function') {
    throw new Error (`Component ${name} is not defined as a function/class`);
  }
  if (isStatelessFunctionComponent (component)) {
    component = transformStatelessFunctionComponent (component);
  }
  if (!component.render && !component.prototype.render) {
    throw new Error (`Component ${name} does not implement render()`);
  }
  component = extendComponent (component, stylesDef, optionsGetter);
  component = extendComponentDisplayName (component, name);
  return component;
}

/******************************************************************************/

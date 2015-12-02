'use strict';

import markComponentAsPure from './mark-component-as-pure.js';
import setComponentDisplayName from './set-component-display-name.js';
import isStatelessFunctionComponent from './is-stateless-function-component.js';
import transformStatelessFunctionComponent from './transform-stateless-function-component.js';

/******************************************************************************/

export default function config (name, component) {
  if (typeof component !== 'function') {
    throw new Error (`Component ${name} is not defined as a function/class`);
  }
  if (isStatelessFunctionComponent (component)) {
    component = transformStatelessFunctionComponent (component);
  }
  if (!component.render && !component.prototype.render) {
    throw new Error (`Component ${name} does not implement render()`);
  }
  component = markComponentAsPure (component);
  component = setComponentDisplayName (component, name);
  return component;
}

/******************************************************************************/

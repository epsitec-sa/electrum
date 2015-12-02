'use strict';

import shallowCompare from 'react-addons-shallow-compare';

export default function markComponentAsPure (component) {
  component.prototype.shouldComponentUpdate = function shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare (this, nextProps, nextState);
  };
  return component;
}

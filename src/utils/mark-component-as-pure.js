'use strict';

import shallowCompare from 'react-addons-shallow-compare';

export default function markComponentAsPure (component) {
  return class extends component {
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare (this, nextProps, nextState);
    }
  };
}

'use strict';

import shallowCompare from 'react-addons-shallow-compare';

import E from '../index.js';

/******************************************************************************/

export default function markComponentAsPure (component) {
  return class extends component {
    shouldComponentUpdate (nextProps, nextState) {
      return shallowCompare (this, nextProps, nextState);
    }
    link (id) {
      return E.link (this.props, id);
    }
    read (id) {
      return E.read (this.props, id);
    }
  };
}

/******************************************************************************/
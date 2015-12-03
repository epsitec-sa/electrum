'use strict';

import {Styles} from 'electrum-theme';
import shallowCompare from 'react-addons-shallow-compare';

import E from '../index.js';

/******************************************************************************/

export default function markComponentAsPure (component, stylesDef) {
  const stylesResolver = Styles.build (stylesDef);
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
    get theme () {
      const {theme} = this.props;
      return theme;
    }
    get styles () {
      const styles = stylesResolver (this.theme);
      const props = this.props;
      const list = styles.get (props);

      list.with = function (...more) {
        styles.with (props, list, more);
        return list;
      };

      return list;
    }
  };
}

/******************************************************************************/

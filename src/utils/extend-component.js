'use strict';

import {Styles} from 'electrum-theme';
import shallowCompare from 'react-addons-shallow-compare';

import E from '../index.js';

/******************************************************************************/

export default function extendComponent (component, stylesDef, optionsGetter) {
  const stylesResolver = Styles.build (stylesDef);
  return class extends component {
    constructor (props) {
      super (props);
      E.inject (this);
    }
    shouldComponentUpdate (nextProps, nextState) {
      const dirty = shallowCompare (this, nextProps, nextState);
      const options = optionsGetter && optionsGetter ();
      if (options && options.log && options.log.shouldComponentUpdate) {
        options.log.shouldComponentUpdate (this, nextProps, nextState, dirty);
      }
      return dirty;
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

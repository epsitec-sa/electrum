'use strict';

import {Styles} from 'electrum-theme';
import shallowCompare from 'react-addons-shallow-compare';

import E from '../index.js';

/******************************************************************************/

export default function extendComponent (component, stylesDef, optionsGetter) {
  const stylesResolver = Styles.create (stylesDef);
  return class extends component {
    constructor (props) {
      super (props);
      E.inject (this);
      E.autoBindHandlers (this);
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
    read (key) {
      return E.read (this.props, key);
    }
    get theme () {
      const {theme} = this.props;
      return theme;
    }
    resolveStyle (name) {
      const styles = stylesResolver (this.theme, this.props);
      return styles.resolve (name);
    }
    get styles () {
      if (!this.theme) {
        throw new Error (`Component ${component.name} not linked to Electrum`);
      }
      const styles = stylesResolver (this.theme, this.props);
      const props = this.props;
      const list = styles.get (props);

      list.with = function (...more) {
        styles.with (list, more);
        return list;
      };

      return list;
    }
  };
}

/******************************************************************************/

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
    link (id, overrides) {
      return E.link (this.props, id, overrides);
    }
    read (key) {
      if (key === undefined) {
        key = 'value';
      }
      if (this.props.hasOwnProperty (key)) {
        return this.props[key];
      }
      return E.read (this.props, key);
    }
    get theme () {
      const {theme} = this.props;
      return theme;
    }
    resolveStyle (...names) {
      if (!this.theme) {
        throw new Error (`Component ${component.name} not linked to Electrum`);
      }
      const styles = stylesResolver (this.theme, this.props);
      return styles.resolve (...names);
    }
    get styles () {
      if (!this.theme) {
        throw new Error (`Component ${component.name} not linked to Electrum`);
      }
      const styles = stylesResolver (this.theme, this.props);
      const props = this.props;
      let current = styles.resolve ('base', props.kind, props.styles, props.style);
      const list = [ current ];
      
      list.with = function (...names) {
        current = styles.merge (current, ...names);
        list[0] = current;
        return list;
      };
      
      return list;
    }
  };
}

/******************************************************************************/

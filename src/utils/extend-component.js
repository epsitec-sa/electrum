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
      if (!theme) {
        throw new Error (`Component ${component.name} not linked to Electrum`);
      }
      return theme;
    }
    
    resolveStyle (...names) {
      const styles = stylesResolver (this.theme, stylesResolver.styles.usesProps && (this.styleProps || this.props));
      return styles.resolve (...names);
    }
    
    get styles () {
      const styles = stylesResolver (this.theme, stylesResolver.styles.usesProps && (this.styleProps || this.props));
      let current = styles.resolve ('base', this.props.kind, this.props.styles, this.props.style);
      
      // We would like to return the style object directly, but then, we
      // could not extend it by attaching the with() function in an invisible
      // manner. Since Radium also accepts array of style objects, we use this
      // trick to provide the with() functionality without interfering with
      // the style object itself. 
      
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

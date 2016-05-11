'use strict';

import {Styles} from 'electrum-theme';
import shallowCompare from 'react-addons-shallow-compare';

import E from '../index.js';

/******************************************************************************/

function createComponentClass (component, optionsGetter) {
  const componentClass = class extends component {
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
  };
  return componentClass;
}

/******************************************************************************/

function injectSingleStyles (componentClass, stylesDef) {
  const stylesResolver = Styles.create (stylesDef);

  componentClass.prototype.mergeStyles = function (...names) {
      const styles = stylesResolver (this.theme, stylesResolver.styles.usesProps && (this.styleProps || this.props));
      return styles.resolve (...names);
    };

  Object.defineProperty (componentClass.prototype, 'styles', {
    get: function styles () {
      const styles = stylesResolver (this.theme, stylesResolver.styles.usesProps && (this.styleProps || this.props));
      let current = styles.resolve ('base', this.props.kind, this.props.styles, this.props.style);

      // We would like to return the style object directly, but then, we
      // could not extend it by attaching the with() function in an invisible
      // manner. Since Radium also accepts array of style objects, we use this
      // trick to provide the with() functionality without interfering with
      // the style object itself.

      const list = [current];

      list.with = function (...names) {
        current = styles.merge (current, ...names);
        list[0] = current;
        return list;
      };

      return list;
    }
  });
}

/******************************************************************************/

function injectMultipleStyles (componentClass, stylesDef) {
  const styleKeys = Object.keys (stylesDef);
  const styleResolvers = {};

  styleKeys.forEach (key => styleResolvers[key] = Styles.create (stylesDef[key]));

  componentClass.prototype.mergeStyles = function (key, ...names) {
    const resolver = styleResolvers[key];
    const styles   = resolver (this.theme, resolver.styles.usesProps && (this.styleProps || this.props));
    return styles.resolve (...names);
  };

  componentClass.prototype.getStyles = function (key) {
    const resolver = styleResolvers[key];
    const styles   = resolver (this.theme, resolver.styles.usesProps && (this.styleProps || this.props));

    let current = styles.resolve ('base', this.props.kind, this.props.styles, this.props.style);

    // We would like to return the style object directly, but then, we
    // could not extend it by attaching the with() function in an invisible
    // manner. Since Radium also accepts array of style objects, we use this
    // trick to provide the with() functionality without interfering with
    // the style object itself.

    const list = [current];

    list.with = function (...names) {
      current = styles.merge (current, ...names);
      list[0] = current;
      return list;
    };

    return list;
  };
}

/******************************************************************************/

export default function extendComponent (component, stylesDef, optionsGetter) {
  const componentClass = createComponentClass (component, optionsGetter);

  if (stylesDef) {
    if (typeof stylesDef === 'object') {
      injectMultipleStyles (componentClass, stylesDef);
    } else {
      injectSingleStyles (componentClass, stylesDef);
    }
  }

  return componentClass;
}

/******************************************************************************/

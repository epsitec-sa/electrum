import radium from 'radium';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import {FieldStates} from 'electrum-field';
import {Store, State} from 'electrum-store';
import {Styles, Theme, ColorManipulator} from 'electrum-theme';
import {Trace} from 'electrum-trace';

import {Action} from './action.js';
import {LinkingMiddleware} from './linking-middleware.js';
import {Electrum} from './electrum.js';

import {captureMouseEvents} from 'electrum-events';

/******************************************************************************/

class RadiumConnector {
  static wrap (component) {
    return radium (component);
  }
}

/******************************************************************************/

export default new Electrum (RadiumConnector);
export {Action, Electrum, LinkingMiddleware};
export {FieldStates};
export {Store, State};
export {Trace};
export {Styles, Theme, ColorManipulator};
export {radium, React, ReactDOM, ReactDOMServer};
export {captureMouseEvents};

/******************************************************************************/

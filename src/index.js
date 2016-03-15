'use strict';

import radium from 'radium';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import {FieldStates} from 'electrum-field';
import {Store, State} from 'electrum-store';
import {Styles, Theme} from 'electrum-theme';

import Action from './action.js';
import LinkingMiddleware from './linking-middleware.js';
import Electrum from './electrum.js';

/******************************************************************************/

class RadiumConnector {
  static wrap (component) {
    return radium (component);
  }
}

/******************************************************************************/

export default new Electrum (RadiumConnector);
export {Action, Electrum, FieldStates, LinkingMiddleware, Store, State, Styles, Theme};
export {radium, React, ReactDOM, ReactDOMServer};

/******************************************************************************/

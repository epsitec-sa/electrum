'use strict';

import React from 'react';
import E from '../index.js';

/******************************************************************************/

export default function Content (props) {
  return <div>{E.read (props, 'text')}</div>;
}

/******************************************************************************/

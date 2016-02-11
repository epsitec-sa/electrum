'use strict';

import React from 'react';
import E from '../index.js';

/******************************************************************************/

// Define component using a stateless function; this will be wrapped by
// transformStatelessFunctionComponent() and converted to a plain class.
export default function Content (props) {
  return <div id='text'>{E.read (props, 'text')}</div>;
}

/******************************************************************************/

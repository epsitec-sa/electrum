/******************************************************************************/

import {isSimpleFunction} from './checks.js';

/******************************************************************************/

export function isStatelessFunctionComponent (func) {
  return isSimpleFunction (func) &&
         func.length === 1;
}

/******************************************************************************/

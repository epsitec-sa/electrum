'use strict';

import {isSimpleFunction} from './checks.js';

export default function isStatelessFunctionComponent (func) {
  return isSimpleFunction (func) &&
         func.length === 1;
}

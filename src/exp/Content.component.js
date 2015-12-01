'use strict';

import React from 'react';
import {Store} from 'electrum-store';

export default function Content (props) {
  return <div>{Store.read (props, 'text')}</div>;
}

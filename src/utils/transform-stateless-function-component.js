/******************************************************************************/

import React from 'react';

/******************************************************************************/

export function transformStatelessFunctionComponent (render, name) {
  const comp = class extends React.Component {
    render () {
      return render (this.props, this.context);
    }
  };
  comp.displayName = name;
  return comp;
}

/******************************************************************************/

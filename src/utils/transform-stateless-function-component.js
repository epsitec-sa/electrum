'use strict';

import React from 'react';

export default function transformStatelessFunctionComponent (render) {
  return class extends React.Component {
    render () {
      return render (this.props, this.context);
    }
  };
}

'use strict';

import React from 'react';

export default function transformStatelessFunctionComponent (render) {
  class Stateless extends React.Component {
    render () {
      return render (this.props);
    }
  }

  return Stateless;
}

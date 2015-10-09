'use strict';

var babel = require ('babel');

module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'modules/**/*.js'},
      {pattern: 'index.js'}
    ],
    tests: [
      {pattern: 'test/*.js'}
    ],
    compilers: {
      '**/*.js': wallaby.compilers.babel ({
        babel: babel,
        // other babel options
        stage: 0    // https://babeljs.io/docs/usage/experimental/
      })
    },
    debug: true,
    env: {
      type: 'node'
    }
  };
};

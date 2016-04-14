/*globals __dirname */
'use strict';
var babel = require ('babel-core');
var fs = require ('fs');
var path = require ('path');

var babelConfig = JSON.parse (fs.readFileSync (path.join (__dirname, '.babelrc')));
babelConfig.babel = babel;

module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'test/test-helper.js'},
      {pattern: 'src/**/*.js'}
    ],
    tests: [
      {pattern: 'src.test/**/*.js'},
    ],
    compilers: {
      '**/*.js*': wallaby.compilers.babel (babelConfig)
    },
    debug: true,
    env: {
      type: 'node'
    },
    bootstrap: function (wallaby) {
      // See http://wallabyjs.com/docs/config/bootstrap.html
      var path = require ('path');
      var sep = path.sep;

      console.log ('Setup wallaby');

      // Ensure that we can require self (just like what module 'require-self'
      // does), but remapping by default the path to './src' rather than './lib'
      // as specified by package "main".
      // See https://github.com/wallabyjs/public/issues/453
      var packageConfig = require (path.join (wallaby.localProjectDir, 'package.json'));
      var packageName = packageConfig.name;
      var modulePrototype = require ('module').Module.prototype;
      if (!modulePrototype._originalRequire) {
        modulePrototype._originalRequire = modulePrototype.require;
        modulePrototype.require = function (filePath) {
          if (filePath === packageName) {
            return modulePrototype._originalRequire.call (this, path.join (wallaby.projectCacheDir, 'src'));
          } else {
            return modulePrototype._originalRequire.call (this, filePath);
          }
        };
      }

      // Remove react from the require.cache, or else some code might not get
      // executed when editing the source code.
      // See https://github.com/wallabyjs/public/issues/321
      Object.keys (require.cache)
        .forEach (function (k) {
          if (k.indexOf (sep + 'react' + sep) > -1) {
            delete require.cache[k];
          }
        });

      // Include the test helper, which sets up the document and window objects
      // as globals:
      require ('./test/test-helper');
    },
    teardown: function () {
      console.log ('Teardown wallaby');
    }
  };
};

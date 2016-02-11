/*globals __dirname */
'use strict';

var path = require ('path');
var root = path.join (__dirname, '..');
var packageConfig = require (path.join (root, 'package.json'));
var packageName = packageConfig.name;
var modulePrototype = require ('module').Module.prototype;

if (!modulePrototype._originalRequire) {
  modulePrototype._originalRequire = modulePrototype.require;
  modulePrototype.require = function (filePath) {
    if (filePath === packageName) {
      filePath = path.join (root, 'src');
    }
    return modulePrototype._originalRequire.call (this, filePath);
  };
}

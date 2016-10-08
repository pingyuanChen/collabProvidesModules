'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (targetDirs, blackList, enableDebug) {
  var alias = {};
  blackList = blackList || {};

  function traverseDir(dir) {
    var stat = fs.statSync(dir);

    if (stat.isDirectory()) {
      fs.readdirSync(dir).forEach(function (file) {
        if (!blackList[file]) {
          traverseDir(path.resolve(dir, file));
        }
      });
      return;
    } else if (stat.isFile()) {
      var moduleName = /^(.*)\.js$/.exec(dir);
      if (!moduleName) {
        return;
      }

      var modulePlatform = /^(.*)\.\w+$/.exec(moduleName[1]),
          module = modulePlatform ? modulePlatform[1] : moduleName[1],
          content = fs.readFileSync(dir, 'utf-8'),
          match = /@providesModule ([\S]+)/.exec(content);
      var aliasLabel = void 0;
      if (match) {
        aliasLabel = match[1];
        if (alias[aliasLabel] && enableDebug) {
          console.warn('Duplicated module ' + aliasLabel + ': ' + dir);
        }
        alias[aliasLabel] = module;
      }
    }
  }

  targetDirs.forEach(traverseDir);

  return alias;
};

var fs = require('fs');
var path = require('path');

module.exports = exports['default'];
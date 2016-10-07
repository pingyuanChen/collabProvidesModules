'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (targetDirs, blackList) {
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
      var content = fs.readFileSync(dir, 'utf-8'),
          match = /@providesModule ([\w\.]+)/.exec(content);
      var aliasLabel = void 0;
      if (match) {
        aliasLabel = match[1];
        if (alias[aliasLabel]) {
          console.warn('Duplicated module ' + aliasLabel + ': ' + dir);
        }
        alias[aliasLabel] = dir;
      }
    }
  }

  targetDirs.forEach(traverseDir);

  return alias;
};

var fs = require('fs');
var path = require('path');
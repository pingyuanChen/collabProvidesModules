const fs = require('fs');
const path = require('path');


export default function(targetDirs, blackList, enableDebug) {
  const alias = {};
  blackList = blackList || {};

  function traverseDir(dir) {
    const stat = fs.statSync(dir);

    if (stat.isDirectory()) {
      fs.readdirSync(dir).forEach((file) => {
        if (!blackList[file]) {
          traverseDir(path.resolve(dir, file));
        }
      });
      return;
    } else if (stat.isFile()) {
      const moduleName = /^(.*)\.js$/.exec(dir);
      if (!moduleName) {
        return;
      }

      const modulePlatform = /^(.*)\.\w+$/.exec(moduleName[1]),
        module = modulePlatform ? modulePlatform[1] : moduleName[1],
        content = fs.readFileSync(dir, 'utf-8'),
        match = /@providesModule ([\w\.]+)/.exec(content);
      let aliasLabel;
      if (match) {
        aliasLabel = match[1];
        if (alias[aliasLabel] && enableDebug) {
          console.warn(`Duplicated module ${aliasLabel}: ${dir}`);
        }
        alias[aliasLabel] = module;
      }
    }
  }

  targetDirs.forEach(traverseDir);

  return alias;
}

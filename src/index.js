const fs = require('fs');
const path = require('path');


export default function(targetDirs, blackList) {
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
      const content = fs.readFileSync(dir, 'utf-8'),
        match = /@providesModule ([\w\.]+)/.exec(content);
      let aliasLabel;
      if (match) {
        aliasLabel = match[1];
        if (alias[aliasLabel]) {
          console.warn(`Duplicated module ${aliasLabel}: ${dir}`);
        }
        alias[aliasLabel] = dir;
      }
    }
  }

  targetDirs.forEach(traverseDir);

  return alias;
}

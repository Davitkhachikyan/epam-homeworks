import fs from 'fs';
import path from 'path';

function findDeepestDirectory(dirPath) {
  let maxDepth = 0;
  let deepestDir;

  function getDirs(currentPath, depth = 1) {
    const files = fs.readdirSync(currentPath);

    if (depth > maxDepth && files.length > 0) {
      maxDepth = depth;
      deepestDir = currentPath;
    }

    for (let file of files) {
      const filePath = path.join(currentPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        getDirs(filePath, depth + 1);
      }
    }
  }

  getDirs(dirPath);

  return deepestDir;
}

const startingDir = 'node_modules';
const deepestDirectory = findDeepestDirectory(startingDir);
console.log('Deepest directory:', deepestDirectory);

fs.writeFile(deepestDirectory + '/teswaxt.txt', 'Hello world', function (err) {
    if (err) throw err;
    console.log('file created');
  });
  
import csv from "csv-parser";
import fs from 'fs';
import path from 'path';

function parse(csvPath) {
  csvPath = path.join('csv', csvPath);

  console.log(csvPath); // if I delete this log, the parsing process fails

  let convertedDir = 'converted';

  let jsonFilePath = path.join(convertedDir, path.basename(csvPath, '.csv') + '.json');

  const writeStream = fs.createWriteStream(jsonFilePath);

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => {
      writeStream.write(JSON.stringify(data) + '\n');
    })
    .on('end', () => {
      console.log('Data written successfully');
      writeStream.end();
    });
}

function countLines(filePath) {
  filePath = path.join('csv', filePath)

  const fileData = fs.readFileSync(filePath, 'utf8');
  const lines = fileData.split('\n');
  return lines.length;
}

export default {
  parse,
  countLines
}









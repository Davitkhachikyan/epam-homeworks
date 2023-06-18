import csv from "csv-parser";
import fs from 'fs';
import path from 'path';

async function parse(csvPath) {
  return new Promise((resolve, reject) => {
    csvPath = path.join('csv', csvPath);

    let convertedDir = 'converted';
    let jsonFilePath = path.join(convertedDir, path.basename(csvPath, '.csv') + '.json');

    const fileData = fs.readFileSync(csvPath, 'utf8');
    const lines = fileData.split('\n');

    const writeStream = fs.createWriteStream(jsonFilePath);
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        writeStream.write(JSON.stringify(data) + '\n', (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(lines.length);
          }
        });
      })
      .on('end', () => {
        console.log(`${csvPath} parsed successfully`)
        writeStream.end();
      });
  })

}

export default {
  parse
}









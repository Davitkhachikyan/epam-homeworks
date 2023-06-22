import * as fs from 'fs';
import * as  path from 'path';
import * as csv from 'csv-parser';

export async function parse(csvPath: string): Promise<number> {

  return new Promise((resolve, reject) => {
    csvPath = path.join('csv', csvPath);

    let convertedDir: string = 'converted';
    let jsonFilePath: string = path.join(convertedDir, path.basename(csvPath, '.csv') + '.json');

    const fileData: string = fs.readFileSync(csvPath, 'utf8');
    const lines = fileData.split('\n');

    const writeStream = fs.createWriteStream(jsonFilePath);
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data: string) => {
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

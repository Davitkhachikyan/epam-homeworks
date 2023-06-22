import { Worker } from 'worker_threads';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

class CsvParse {

  csvDir: string;

  constructor(csvDir: string) {
    this.csvDir = csvDir;

  }

  async readDirectory(path: string): Promise<string[]> {
    try {
      const files: string[] = await fs.readdir(path);
      return files;
    } catch (error) {
      console.error('Error reading directory:', error);
      throw error;
    }
  }

  runTask(): Promise<number> {
  const __filename:string = fileURLToPath(import.meta.url);
      const __dirname:string = path.dirname(__filename)
// 
    return new Promise((resolve, reject) => {
      let total: number = 0;
        
      this.readDirectory(this.csvDir)
        .then((files) => {
          const size: number = files.length > 10 ? 10 : files.length;

          for (let i = 0; i < size; i++) {
            let worker: Worker = new Worker(path.join(__dirname, './worker.js'));
            worker.on('online', () => {
              worker.postMessage(files[i]);
            });

            worker.on('message', (msg) => {
              total += msg;
              worker.terminate();
            });
          }
        })
        .then(() => resolve(total))
        .catch((error) => reject(error));
    });
  }

}

let obj: CsvParse = new CsvParse('csv');

export default CsvParse;
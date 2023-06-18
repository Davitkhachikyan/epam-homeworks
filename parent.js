import { Worker } from 'worker_threads';
import fs from 'fs/promises';

class CsvParse {
    constructor() {
        this.csvDir = 'csv';
    }

    async readDirectory(path) {
        try {
            const files = await fs.readdir(path);
            return files;
        } catch (error) {
            console.error('Error reading directory:', error);
        }
    }

    runTask() {
        return new Promise((resolve, reject) => {
            let total = 0;

            this.readDirectory(this.csvDir)
                .then((files) => {
                    const size = files.length > 10 ? 10 : files.length;
                    
                    for (let i = 0; i < size; i++) {
                        let worker = new Worker('./worker.js');
                        worker.on('online', () => {
                            worker.postMessage(files[i]);
                        });

                        worker.on('message', (msg) => {
                            console.log(msg)
                            total += msg;
                            worker.terminate();
                        });
                        // worker.on('error', reject(error));
                    }
                })
                .then(resolve(total))
                .catch((error) => reject(error));
        });
    }
}

let obj = new CsvParse();

let totalCount = await obj.runTask()
console.log(totalCount);

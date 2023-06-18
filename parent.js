import { Worker } from 'worker_threads';
import fs from 'fs/promises';

class CsvParse {
    constructor() {
        this.csfDir = 'csv',
            this.result = 0;
    }

    async readDirectory(path) {
        try {
            const files = await fs.readdir(path);
            return files;
        } catch (error) {
            console.error('Error reading directory:', error);
        }
    }

    async runtask() {
        let files = await this.readDirectory('csv');
        let size = files.length > 10 ? 10 : files.length;

        for (let i = 0; i < size; i++) {
            let worker = new Worker('./worker.js');
            worker.on('online', () => {
                worker.postMessage(files[i]);
            });

            worker.on('message', (msg) => {
                this.result += msg   // this line doesn't work
                worker.terminate();
            })
            worker.on('error', (error) =>
                console.log('this is error: ', error)
            )
        }
    }
}

let obj = new CsvParse()

obj.runtask();


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Worker } from 'worker_threads';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
class CsvParse {
    constructor(csvDir) {
        this.csvDir = csvDir;
    }
    readDirectory(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield fs.readdir(path);
                return files;
            }
            catch (error) {
                console.error('Error reading directory:', error);
                throw error;
            }
        });
    }
    runTask() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // 
        return new Promise((resolve, reject) => {
            let total = 0;
            this.readDirectory(this.csvDir)
                .then((files) => {
                const size = files.length > 10 ? 10 : files.length;
                for (let i = 0; i < size; i++) {
                    let worker = new Worker(path.join(__dirname, './worker.js'));
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
let obj = new CsvParse('csv');
export default CsvParse;

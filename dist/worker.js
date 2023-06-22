import { parentPort } from 'worker_threads';
import { parse } from './csvHelper.js';
parentPort === null || parentPort === void 0 ? void 0 : parentPort.on('message', (msg) => {
    try {
        parse(msg)
            .then((result) => parentPort === null || parentPort === void 0 ? void 0 : parentPort.postMessage(result))
            .catch(error => {
            console.log(`Error from worker: ${error}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});

import { parentPort } from 'worker_threads';
import csvHelper from './csvHelper.js'

parentPort.on('message', (msg) => {
    csvHelper.parse(msg);

    let result = csvHelper.countLines(msg)

    parentPort.postMessage(result);
})
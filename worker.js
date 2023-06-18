import { parentPort } from 'worker_threads';
import csvHelper from './csvHelper.js'


parentPort.on('message', (msg) => {
    try {
        csvHelper.parse(msg)
        .then((result) => parentPort.postMessage(result))
        .catch(error => {
            console.log(`Error from worker: ${error}`)
        })
    } catch (error) {
        console.log(error)
    }
   
   
})

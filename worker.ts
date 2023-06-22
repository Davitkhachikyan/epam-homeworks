import { parentPort}  from 'worker_threads';
import { parse }  from './csvHelper.js'

parentPort?.on('message', (msg: string) => {
    try {
        parse(msg)
        .then((result) => parentPort?.postMessage(result))
        .catch(error => {
            console.log(`Error from worker: ${error}`)
        })
    } catch (error) {
        console.log(error)
    }
   
})

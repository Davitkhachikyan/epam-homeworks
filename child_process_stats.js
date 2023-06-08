import { spawn } from 'child_process';
import { writeFile } from 'fs/promises'

class Statistics {
    runCommand(command, args = [], timeout) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const startTime = new Date().toString();
            const childProcess = spawn(command, args, {
                timeout
            });

            let stats = {
                start: startTime,
                success: true,
                commandSuccess: false,
            };

            childProcess.on('error', (err) => {
                stats.error = err.message;
                stats.success = false;
            });

            childProcess.stderr.on('data', () => {
                stats.success = false;
            })

            childProcess.on('exit', () => {
                stats.commandSuccess = true;
            });

            childProcess.stdout.on('data', (data) => {
                console.log(data.toString());
            })

            childProcess.on('close', () => {
                stats.duration = Date.now() - start;
                writeFile(`logs/${start}_${command}`, JSON.stringify(stats))
                    .then(resolve)
                    .catch(reject);
            });
        })
    }
}

let instance = new Statistics();

instance.runCommand('driverquery');
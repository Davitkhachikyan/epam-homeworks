import os from 'node:os';
import { EventEmitter } from "node:events"

const myEmitter = new EventEmitter();

const args = {
    '--cpus': os.cpus(),
    '--homedir': os.homedir(),
    '--username': os.userInfo()['username'],
    '--architecture': process.arch,
    '--platform': os.platform(),
    '--memory': os.totalmem(),
    '--hostname': os.hostname()
}

process.stdout.write(`Welcome ${os.userInfo()['username']} \n`);

process.stdin.on('data', (data) => {
    const input = data.toString().trim();
    const [command, arg] = input.split(' ');

    handleInput(command, arg);
});

function exit(userName) {
    process.stdout.write(`Thank you ${userName}, goodbye!`);
    process.exit();
}

function handleInput(command, arg) {
    command == '.exit' ? exit(os.userInfo()['username'])
    : command != 'os' 
    ? process.stdout.write('Invalid input \n')
    : console.log(args[arg] ?? 'Invalid input');
}


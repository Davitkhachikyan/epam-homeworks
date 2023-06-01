import os from 'node:os';
import { EventEmitter } from "node:events"
import fs from 'fs';
import path from 'node:path';
import { getAllFiles, getAllFilesSync } from 'get-all-files';
import Table from 'cli-table';

const myEmitter = new EventEmitter();

const args = {
    'os --cpus': os.cpus(),
    'os --homedir': os.homedir(),
    'os --username': os.userInfo()['username'],
    'os --architecture': process.arch,
    'os --platform': os.platform(),
    'os --memory': os.totalmem(),
    'os --hostname': os.hostname(),
    'add': add,
    'rn': rn,
    'cp': cp,
    'mv': mv,
    'rm': rm,
    'ls': ls
}

process.stdout.write(`Welcome ${os.userInfo()['username']} \n`);

process.stdin.on('data', (data) => {
    const input = data.toString().trim();
    let command = input.split(' ')[0]
    let props = input.split(' ').slice(1, 3)
    
// console.log(props);
    handleInput(input , command, props);
});

function exit(userName) {
    process.stdout.write(`Thank you ${userName}, goodbye!`);
    process.exit();
}

function handleInput(input, command, props) {
  
    if (command == '.exit') {
        exit(os.userInfo()['username'])
        
    } else if(command == 'ls') {
        args[command]();
    } 
    else (
        args[command] ? args[command](props)  : args[input] ?console.log(args[input]): console.log('invalid input')
    )
}

function add(file) {
    fs.writeFile(file[0], 'Hello world', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
}

function rn(data) {
 
    let from = data[0]
    let to = data[1]
    fs.rename(from, to, (err) => {
        if (err) throw err;
    })
}

function cp(data) {
    const file = path.basename(data[0]);
    const to = path.join(data[1], file);

    fs.copyFile(data[0], to, (err) => {

        if (err) throw err;
    })
}

function mv(data) {

    const fileName = path.basename(data[0]);
    const to = path.join(data[1], fileName);

    fs.rename(data[0], to, (err) => {

        if (err) throw err;
    })
}

function rm(data) {
    fs.unlink(data[0], (err) => {
        if (err) throw err;
    })
}

async function ls() {
    var table = new Table({
        head: ['index', 'name', 'type']
      , colWidths: [20, 50]
    });
    let count = 0;
    let dirs =   fs.readdir('./', function (err, files) {
    
        let arr = []
        files.forEach(function (file) {
            arr.push(file); 
        });

        for(let i of arr) {
            table.push([count ++, path.basename(i), path.extname(i)])
            console.log(table.toString()) ;
        }
    });
   
    
}



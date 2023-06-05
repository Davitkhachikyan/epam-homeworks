import fs from 'fs';
import { Transform } from 'stream';

const args = process.argv.slice(2);

if (args.length < 3) {
    console.error('Invalid input');
    process.exit(1);
}

const readableStream = fs.createReadStream(args[0]);
const writableStream = fs.createWriteStream(args[1]);

readableStream.on('error', (err) => {
    console.error('Error reading the file:', err);
});

writableStream.on('error', (err) => {
    console.error('Error writing the file:', err);
});

function handleCommand(operation) {
    return new Transform({
        transform(chunk, encoding, callback) {
            callback(null, operation(chunk.toString()));
        },
    });
}

const operations = {
    lowercase: (arg) => arg.toLowerCase(),
    reverse: (arg) => [...arg].reverse().join(''),
    uppercase: (arg) => arg.toUpperCase()

}

const operation = operations[args[2]];

if (!operation) {
    console.error(`Invalid operation: ${args[2]}`);
    process.exit(1);
}

const transformStream = handleCommand(operation);

transformStream.on('error', (err) => {
    console.error('Error transforming the data:', err);
});

readableStream.pipe(transformStream).pipe(writableStream);

writableStream.on('finish', () => {
    console.log('Data transformed successfully.');
});
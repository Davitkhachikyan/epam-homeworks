var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as http from 'http';
import { parse as parseUrl } from 'url';
import { promises as fs } from 'fs';
import * as path from 'path';
import CsvParse from './parent.js';
const server = http.createServer((request, response) => {
    const parsedUrl = parseUrl(request.url, true);
    const pathname = parsedUrl.pathname;
    if (request.method === 'GET' && pathname === '/files') {
        const directoryPath = 'converted';
        fs.readdir(directoryPath)
            .then((files) => __awaiter(void 0, void 0, void 0, function* () {
            const jsonFiles = files.filter((file) => path.extname(file) === '.json');
            const fileContents = yield Promise.all(jsonFiles.map((file) => fs.readFile(path.join(directoryPath, file))));
            response.end(fileContents.toString());
        }))
            .catch(() => response.end(JSON.stringify('Error reading files')));
    }
    else if (request.method === 'GET' && pathname.startsWith('/files/')) {
        const filename = pathname.slice(7);
        const filePath = path.join('converted', filename);
        fs.readFile(filePath)
            .then((result) => response.end(result))
            .catch(() => response.end(JSON.stringify('File not found')));
    }
    else if (request.method === 'POST' && pathname === '/exports') {
        request.on('data', (chunk) => __awaiter(void 0, void 0, void 0, function* () {
            let csvDir = JSON.parse(chunk.toString()).path;
            try {
                yield fs.access(csvDir);
                let parser = new CsvParse(csvDir);
                parser.runTask();
                response.end(JSON.stringify('Data parsed successfully'));
            }
            catch (error) {
                response.end(JSON.stringify('Directory not found'));
            }
        }));
    }
    else if (request.method === 'DELETE' && pathname.startsWith('/files/')) {
        const filename = pathname.slice(7);
        const filePath = path.join('converted', filename);
        fs.unlink(filePath)
            .then(() => response.end(JSON.stringify('File deleted successfully')))
            .catch(() => response.end(JSON.stringify('File not found')));
    }
});
const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

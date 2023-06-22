import * as http from 'http';
import { UrlWithParsedQuery, parse as parseUrl } from 'url';
import { promises as fs } from 'fs';
import * as path from 'path';
import CsvParse from './parent.js';

const server: http.Server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
    const parsedUrl: UrlWithParsedQuery = parseUrl(request.url!, true);
    const pathname: string = parsedUrl.pathname!;
    if (request.method === 'GET' && pathname === '/files') {
        const directoryPath: string = 'converted';

        fs.readdir(directoryPath)
            .then(async (files: string[]) => {
                const jsonFiles = files.filter((file) => path.extname(file) === '.json');

                const fileContents = await Promise.all(
                    jsonFiles.map((file) => fs.readFile(path.join(directoryPath, file)))
                );

                response.end(fileContents.toString());
            })
            .catch(() => response.end(JSON.stringify('Error reading files')));
    } else if (request.method === 'GET' && pathname.startsWith('/files/')) {
        const filename: string = pathname.slice(7);
        const filePath = path.join('converted', filename);

        fs.readFile(filePath)
            .then((result: Buffer) => response.end(result))
            .catch(() => response.end(JSON.stringify('File not found')));
    } else if (request.method === 'POST' && pathname === '/exports') {
        request.on('data', async (chunk: Buffer) => {
            let csvDir = JSON.parse(chunk.toString()).path;
            try {
                await fs.access(csvDir);
                let parser = new CsvParse(csvDir);
                parser.runTask();
                response.end(JSON.stringify('Data parsed successfully'));
            } catch (error) {
                response.end(JSON.stringify('Directory not found'));
            }
        });
    } else if (request.method === 'DELETE' && pathname.startsWith('/files/')) {
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

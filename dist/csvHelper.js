var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
export function parse(csvPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            csvPath = path.join('csv', csvPath);
            let convertedDir = 'converted';
            let jsonFilePath = path.join(convertedDir, path.basename(csvPath, '.csv') + '.json');
            const fileData = fs.readFileSync(csvPath, 'utf8');
            const lines = fileData.split('\n');
            const writeStream = fs.createWriteStream(jsonFilePath);
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (data) => {
                writeStream.write(JSON.stringify(data) + '\n', (error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(lines.length);
                    }
                });
            })
                .on('end', () => {
                console.log(`${csvPath} parsed successfully`);
                writeStream.end();
            });
        });
    });
}

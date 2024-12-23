import * as fs from 'fs';
import * as XLSX from 'xlsx';
import * as csv from 'csv-parser';
import { IDataReaderHelper } from '../../ports';

export class DataReaderHelper implements IDataReaderHelper {

    readExcel(filePath: string, sheetName?: string): object[] {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet);
    }

    readCSV(filePath: string): Promise<object[]> {
        return new Promise((resolve, reject) => {
            const rows: object[] = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => rows.push(row))
                .on('end', () => resolve(rows))
                .on('error', (error) => reject(error));
        });
    }
}

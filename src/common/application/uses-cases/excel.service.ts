import * as fs from 'fs';
import ExcelJS from 'exceljs';
import { IExcelService } from '@common/ports';

export class ExcelService implements IExcelService {

    async readExcel(filePath: string, sheetName?: string): Promise<object[]> {
        if (!fs.existsSync(filePath)) {
            throw new Error(`El archivo ${filePath} no existe.`);
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.getWorksheet(sheetName || workbook.worksheets[0].name);

        if (!sheet) {
            throw new Error(`La hoja ${sheetName || 'default'} no existe en el archivo.`);
        }

        const rows: object[] = [];
        let headers: string[] = [];

        sheet.eachRow((row, rowIndex) => {
            const values = row.values;

            // Verificar si values es un array (ignorar otros formatos)
            if (Array.isArray(values)) {
                if (rowIndex === 1) {
                    // Usar la primera fila como encabezados
                    headers = values.slice(1).map((header) => header?.toString() || '');
                } else {
                    // Crear un objeto con los valores de las filas restantes
                    const rowData: any = {};
                    values.slice(1).forEach((cell, colIndex) => {
                        const key = headers[colIndex]; // Mapear con los encabezados
                        if (key) {
                            rowData[key] = cell;
                        }
                    });
                    rows.push(rowData);
                }
            }
        });

        return rows;
    }

    async writeExcel(filePath: string, sheetName: string, data: object[]): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(sheetName);

        const headers = Object.keys(data[0]);
        sheet.columns = headers.map((header) => ({ header, key: header, width: 20 }));

        data.forEach((row) => sheet.addRow(row));

        await workbook.xlsx.writeFile(filePath);
        console.log(`Archivo Excel guardado en ${filePath}`);
    }

    async readCSV(filePath: string): Promise<object[]> {
        if (!fs.existsSync(filePath)) {
            throw new Error(`El archivo ${filePath} no existe.`);
        }

        const workbook = new ExcelJS.Workbook();
        const csvSheet = await workbook.csv.readFile(filePath);

        const rows: object[] = [];
        csvSheet.eachRow((row, rowIndex) => {
            const rowData: any = {};
            row.eachCell((cell, colIndex) => {
                rowData[`Column${colIndex}`] = cell.value;
            });
            rows.push(rowData);
        });

        return rows;
    }

    async writeCSV(filePath: string, data: object[]): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('CSVData');

        const headers = Object.keys(data[0]);
        sheet.columns = headers.map((header) => ({ header, key: header }));

        data.forEach((row) => sheet.addRow(row));

        const csvWriter = fs.createWriteStream(filePath);
        await workbook.csv.write(csvWriter);
        console.log(`Archivo CSV guardado en ${filePath}`);
    }

    async applyStyles(filePath: string, sheetName: string, styles: object[]): Promise<void> {
        if (!fs.existsSync(filePath)) {
            throw new Error(`El archivo ${filePath} no existe.`);
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.getWorksheet(sheetName);

        if (!sheet) {
            throw new Error(`La hoja ${sheetName} no existe en el archivo.`);
        }

        styles.forEach((style: any, index: number) => {
            const column = sheet.getColumn(index + 1);
            if (style.width) column.width = style.width;
            if (style.alignment) column.alignment = style.alignment;
        });

        await workbook.xlsx.writeFile(filePath);
        console.log(`Estilos aplicados a la hoja ${sheetName} en ${filePath}`);
    }
}

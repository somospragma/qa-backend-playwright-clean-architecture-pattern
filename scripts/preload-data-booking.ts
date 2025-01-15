import { ExcelService } from "../src/common/application";
import { IExcelService } from "../src/common/ports";

import * as fs from 'fs';
import path from 'path';

(async () => {
    const excelService: IExcelService = new ExcelService();
    const testData = await excelService.readExcel("tests/data/testData.xlsx", "booking");

    const outputPath = path.resolve(__dirname, '../tests/json/testDataBooking.json');
    fs.writeFileSync(outputPath, JSON.stringify(testData, null, 2));

    console.log('Datos del Excel cargados correctamente en:', outputPath);
})();

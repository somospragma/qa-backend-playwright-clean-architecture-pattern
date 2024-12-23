export interface IDataReaderHelper {
    /**
     * Lee datos de un archivo Excel (.xlsx) y los convierte a formato JSON.
     * @param filePath - string - Ruta del archivo Excel.
     * @param sheetName - string - Nombre de la hoja (opcional, por defecto usa la primera hoja).
     * @returns object[] - Array de objetos representando las filas del archivo Excel.
     */
    readExcel(filePath: string, sheetName?: string): object[];

    /**
     * Lee datos de un archivo CSV y los convierte a formato JSON.
     * @param filePath - string - Ruta del archivo CSV.
     * @returns Promise<object[]> - Promise que resuelve con un array de objetos representando las filas del archivo CSV.
     */
    readCSV(filePath: string): Promise<object[]>
}
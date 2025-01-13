export interface IExcelService {
    /**
     * Lee datos de una hoja de un archivo Excel.
     * @param filePath string - Ruta del archivo Excel.
     * @param sheetName string - Nombre de la hoja (opcional, usa la primera hoja si no se especifica).
     * @returns Promise<object[]> - Array de objetos que representan las filas de la hoja.
     */
    readExcel(filePath: string, sheetName?: string): Promise<object[]>;

    /**
     * Escribe datos en una hoja de un archivo Excel.
     * @param filePath string - Ruta donde se guardará el archivo Excel.
     * @param sheetName string - Nombre de la hoja.
     * @param data  object[] - Datos a escribir, como un array de objetos.
     */
    writeExcel(filePath: string, sheetName: string, data: object[]): Promise<void>;

    /**
     * Lee datos de un archivo CSV.
     * @param filePath string - Ruta del archivo CSV.
     * @returns Promise<object[]> - Array de objetos que representan las filas del archivo CSV.
     */
    readCSV(filePath: string): Promise<object[]>;

    /**
     * Escribe datos en un archivo CSV.
     * @param filePath string - Ruta donde se guardará el archivo CSV.
     * @param data object[] - Datos a escribir, como un array de objetos.
     */
    writeCSV(filePath: string, data: object[]): Promise<void>;

    /**
     * Aplica estilos básicos a una hoja.
     * @param filePath string - Ruta del archivo Excel.
     * @param sheetName string - Nombre de la hoja.
     * @param styles object[] - Configuración de estilos básicos para las columnas.
     */
    applyStyles(filePath: string, sheetName: string, styles: object[]): Promise<void>;
}

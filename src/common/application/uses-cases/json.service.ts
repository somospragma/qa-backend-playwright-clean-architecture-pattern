import * as fs from 'fs';

export const readJson = <T>(filePath: string): T[] => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`El archivo ${filePath} no existe.`);
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData) as T[];
};

export const writeJson = <T>(filePath: string, data: T[]): void => {
    const formattedData = JSON.stringify(data, null, 2); // Formatear JSON para mejor legibilidad
    fs.writeFileSync(filePath, formattedData, 'utf-8');
    console.log(`Datos guardados correctamente en: ${filePath}`);
};

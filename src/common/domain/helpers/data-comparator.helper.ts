import fs from "fs";
import path from "path";
import { IDataComparatorHelper } from "@common/ports";

export class DataComparatorHelper<T extends Record<string, any>> implements IDataComparatorHelper<T> {
    compareAndLog(expected: T, received: T, identifier: string, savePath: string): void {
        const mismatches: Record<string, { expected: any; received: any }> = {};

        for (const key in expected) {
            if (expected[key] !== received[key]) {
                mismatches[key] = { expected: expected[key], received: received[key] };
            }
        }

        if (Object.keys(mismatches).length > 0) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const fileName = `mismatch-${identifier}-${timestamp}.json`;
            const outputPath = path.resolve(savePath, fileName);
            const content = {
                expected,
                received,
                mismatches,
            };

            fs.writeFileSync(outputPath, JSON.stringify(content, null, 2), "utf-8");
            console.warn(`⚠️ Inconsistencias encontradas para "${identifier}". Log guardado en: ${fileName}`);
        } else {
            console.log(`✅ Los datos coinciden correctamente para "${identifier}"`);
        }
    }
}

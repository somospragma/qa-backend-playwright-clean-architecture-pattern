import Ajv, { ValidateFunction, ErrorObject } from "ajv";
import { IJSONSchema, IResponseValidatorHelper } from "@common/ports";

export class ResponseValidatorHelper implements IResponseValidatorHelper {
    private ajv: Ajv;
    private validateFunction: ValidateFunction;

    constructor(schema: IJSONSchema) {
        this.ajv = new Ajv({ allErrors: true, verbose: true });
        this.validateFunction = this.ajv.compile(schema);
    }

    validateResponse(bodyResponse: { [key: string]: string }): boolean {
        console.log("🔍 Esquema esperado:");
        console.log(JSON.stringify(this.validateFunction.schema, null, 2));

        console.log("📥 Respuesta recibida:");
        console.log(JSON.stringify(bodyResponse, null, 2));

        const isValid = this.validateFunction(bodyResponse);

        if (!isValid) {
            console.log("❌ Errores de validación:");
            this.logValidationErrors(this.validateFunction.errors!, bodyResponse);
            return false;
        }

        console.log("✅ Validación exitosa: La respuesta cumple con el esquema.");
        return true;
    }

    private logValidationErrors(errors: ErrorObject[], received: any): void {
        errors.forEach(error => {
            console.log(`\n🔴 Error en: ${error.instancePath || "(raíz)"}`);
            console.log("📝 Error del esquema:", error.message);

            const expected = this.getExpectedValue(error);
            console.log("🔹 Esto es lo que espera:", JSON.stringify(expected, null, 2));

            const receivedValue = this.getReceivedValue(received, error.instancePath);
            console.log("🔸 Esto es lo que recibió:", JSON.stringify(receivedValue, null, 2));
        });
    }

    private getExpectedValue(error: ErrorObject): any {
        return error.params;
    }

    private getReceivedValue(obj: any, path: string): any {
        const keys = path.split('/').filter(Boolean);
        return keys.reduce((acc, key) => acc && acc[key], obj);
    }
}

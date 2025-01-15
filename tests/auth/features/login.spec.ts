import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import { LoginService } from "@auth/application";
import { ExcelService } from "@common/application";
import { IExcelService } from "@common/ports";

import * as fs from "fs";
import path from "path";

const dataPath = path.resolve(__dirname, "../../json/testDataLogin.json");
const testData: Record<string, any>[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
let dataToken: { token: string; status: string }[] = [];

test.describe("Login API Test Suite", () => {
    const excelService: IExcelService = new ExcelService();
    let loginService: LoginService;
    let apiContext: APIRequestContext;

    test.beforeAll(async () => {
        // Crear un contexto de solicitud API
        apiContext = await playwrightRequest.newContext({
            baseURL: process.env.URL,
            extraHTTPHeaders: {
                "Content-Type": "application/json",
            },
        });

        // Inicializar LoginService con el contexto de solicitud
        loginService = new LoginService(apiContext);
    });

    testData.forEach((data, index) => {
        test(`Validar el login - Caso ${index + 1}`, async () => {
            let responseStatus = 0;
            let token: string | null = null;

            await test.step("Consumir el servicio de login", async () => {
                await loginService.consumeService({
                    username: data.Username,
                    password: data.Password,
                });

                responseStatus = loginService.responsePlaywright.status();
                token = loginService.token;

                // Reportar resultados
                loginService.reportEnd(responseStatus, token, token ? true : false);
            });

            await test.step("Guardar el token en el array", async () => {
                // Si el status es 200, agregar el token al array dataToken
                if (responseStatus === 200 && token) {
                    dataToken.push({
                        token,
                        status: `${responseStatus}`,
                    });
                } else 
                    console.log(`⚠️ El caso ${index + 1} no generó un token válido.`);
            });

            await test.step("Validar el token extraído", async () => {
                expect(responseStatus).toBe(200);
                expect(token).not.toBeNull();
            });
        });
    });

    test.afterAll(async () => {
        if (dataToken.length > 0) {
            await excelService.writeExcel("tests/data/testDataToken.xlsx", "token", dataToken);
            console.log("✅ Tokens exitosos guardados en el archivo Excel.");
        } else
            console.log("❌ No hay tokens exitosos para guardar.");


        // Cerrar el contexto de solicitud
        await apiContext.dispose();
    });
});

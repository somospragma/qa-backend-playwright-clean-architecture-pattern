import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import { LoginService } from "@auth/application/uses-cases";
import { ExcelHelper } from "@common/domain/helpers";
import { IExcelHelper } from "@common/ports";

test.describe("Login API Test Suite", () => {
    let apiContext: APIRequestContext;
    let loginService: LoginService;
    let excelHelper: IExcelHelper = new ExcelHelper();
    let testData: Record<string, any>[];

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

        // Leer datos del archivo Excel
        testData = await excelHelper.readExcel("tests/data/testData.xlsx", 'login');
    });

    test.afterAll(async () => {
        // Cerrar el contexto de solicitud
        await apiContext.dispose();
    });

    test("Validar el login con datos del Excel", async () => {
        for (const data of testData) {
            // Consumir el servicio con los datos del Excel
            await loginService.consumeService({
                username: data.Username,
                password: data.Password,
            });

            // Validar el token extraído
            console.log(`Token extraído para usuario ${data.Username}: ${loginService.token}`);

            // Reportar el final de la prueba
            loginService.reportEnd(loginService.responsePlaywright.status(), loginService.token, loginService.token ? true : false);
        }
    });
});

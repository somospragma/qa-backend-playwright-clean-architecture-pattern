import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import { LoginService } from "@auth/application";
import { ExcelService } from "@common/application";
import { IExcelService } from "@common/ports";

test.describe("Login API Test Suite", () => {
    let apiContext: APIRequestContext;
    let loginService: LoginService;
    let excelService: IExcelService = new ExcelService();
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
        testData = await excelService.readExcel("tests/data/testData.xlsx", 'login');
    });

    test("Validar el login con datos del Excel", async () => {
        const dataToken: { token: string; }[] = [];

        for (const dataLogin of testData) {
            // Consumir el servicio con los datos del Excel
            await loginService.consumeService({
                username: dataLogin.Username,
                password: dataLogin.Password,
            });

            // Reportar el final de la prueba
            loginService.reportEnd(loginService.responsePlaywright.status(), loginService.token, loginService.token ? true : false);

            // Validar el token extraído
            expect(loginService.token).not.toBeNull();

            dataToken.push({ token: loginService.token! })
        }
        await excelService.writeExcel('tests/data/testDataToken.xlsx', 'token', dataToken)
    });

    test.afterAll(async () => {
        // Cerrar el contexto de solicitud
        await apiContext.dispose();
    });
});

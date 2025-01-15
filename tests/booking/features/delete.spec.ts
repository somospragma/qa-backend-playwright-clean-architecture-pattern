import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import { ExcelService } from "@common/application";
import { IExcelService } from "@common/ports";
import { BookingDeleteService } from "@booking/application";
import { IBookingDeleteService } from "@booking/ports";

test.describe("List API Test Suite", () => {
    let apiContext: APIRequestContext;
    let bookingDeleteService: IBookingDeleteService;
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
        bookingDeleteService = new BookingDeleteService(apiContext);

        // Leer datos del archivo Excel
        testData = await excelService.readExcel("tests/data/testDataToken.xlsx", 'token');
    });

    test("Validar el read con los Tokens del Excel", async () => {
        for (const dataToken of testData) {
            // Consumir el servicio con los datos del Excel
            await bookingDeleteService.consumeService(dataToken.token, '1');
            
            // Reportar el final de la prueba
            bookingDeleteService.reportEnd(bookingDeleteService.responsePlaywright.status(), bookingDeleteService.token, bookingDeleteService.token ? true : false);
            
            // Validar automatización
            expect(bookingDeleteService.responsePlaywright.status()).toBe(200);
        }
    });

    test.afterAll(async () => {
        // Cerrar el contexto de solicitud
        await apiContext.dispose();
    });
});

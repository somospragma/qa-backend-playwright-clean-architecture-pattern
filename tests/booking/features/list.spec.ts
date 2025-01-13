import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import { ExcelService } from "@common/application";
import { IExcelService } from "@common/ports";
import { BookingListService } from "@booking/application";
import { IBookingListService } from "@booking/ports";

test.describe("List API Test Suite", () => {
    let apiContext: APIRequestContext;
    let bookingListService: IBookingListService;
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
        bookingListService = new BookingListService(apiContext);

        // Leer datos del archivo Excel
        testData = await excelService.readExcel("tests/data/testDataToken.xlsx", 'token');
    });

    test("Validar la lista con los Tokens del Excel", async () => {
        for (const dataToken of testData) {
            // Consumir el servicio con los datos del Excel
            await bookingListService.consumeService(dataToken.token, '1');
            
            const dataresponse = (bookingListService.listBooking) ? bookingListService.listBooking.bookings : [];
            
            const isValidatoJson = bookingListService.validatorJsonSchema(await bookingListService.responsePlaywright.json())

            // Reportar el final de la prueba
            bookingListService.reportEnd(bookingListService.responsePlaywright.status(), bookingListService.listBooking, dataresponse.length > 0 ? true : false);
            
            // Validar automatización
            expect(isValidatoJson).toBe(true);
            expect(bookingListService.responsePlaywright.status()).toBe(200);
        }
    });

    test.afterAll(async () => {
        // Cerrar el contexto de solicitud
        await apiContext.dispose();
    });
});

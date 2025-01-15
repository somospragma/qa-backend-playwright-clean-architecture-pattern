import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import { BookingListService } from "@booking/application";
import { ExcelService } from "@common/application";

import * as fs from 'fs';
import path from 'path';
import { IBookingListService } from "@booking/ports";

const dataPath = path.resolve(__dirname, '../../json/testDataToken.json');
const testData: Record<string, any>[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8')); 

test.describe("List API Test Suite", () => {
    let apiContext: APIRequestContext;
    let bookingListService: IBookingListService;
    let dataToken: Record<string, any>[] = [];

    test.beforeAll(async () => {
        apiContext = await playwrightRequest.newContext({
            baseURL: process.env.URL,
            extraHTTPHeaders: {
                "Content-Type": "application/json",
            },
        });

        bookingListService = new BookingListService(apiContext);
    });

    testData.forEach((data, index) => {
        test(`Validar la lista con el Token del Excel - Caso ${index + 1}`, async () => {
            await test.step("Consumir el servicio con token", async () => {
                await bookingListService.consumeService(data.token, "");
            });

            const responseData = await bookingListService.responsePlaywright.json();
            const isValidatoJson = bookingListService.validatorJsonSchema(responseData);

            await test.step("Reportar el resultado de la prueba", async () => {
                bookingListService.reportEnd(
                    bookingListService.responsePlaywright.status(),
                    bookingListService.listBooking,
                    bookingListService.listBooking?.bookings.length > 0 ? true : false
                );
            });

            await test.step("Validar la respuesta del servicio", async () => {
                const dataresponse = bookingListService.listBooking ? bookingListService.listBooking.bookings : [];
                dataToken = dataresponse;

                expect(isValidatoJson).toBe(true);
                expect(bookingListService.responsePlaywright.status()).toBe(200);
                expect(dataresponse.length).toBeGreaterThan(0);
            });
        });
    });

    test.afterAll(async () => {
        const excelService = new ExcelService();
        if (bookingListService.responsePlaywright.status() === 200) await excelService.writeExcel("tests/data/testDataBooking.xlsx", "list-booking", dataToken);

        await apiContext.dispose();
    });
});

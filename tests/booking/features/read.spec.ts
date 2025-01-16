import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import * as fs from 'fs';
import path from 'path';

import { BookingReadService } from "@booking/application";
import { IBookingReadService } from "@booking/ports";

const dataPathToken = path.resolve(__dirname, '../../json/testDataToken.json');
const testDataToken: Record<string, any>[] = JSON.parse(fs.readFileSync(dataPathToken, 'utf-8'));

const dataPathBooking = path.resolve(__dirname, '../../json/testDataBookingList.json');
const testListBooking: Record<string, any>[] = JSON.parse(fs.readFileSync(dataPathBooking, 'utf-8'));

test.describe("List API Test Suite", () => {
    let apiContext: APIRequestContext;
    let bookingReadService: IBookingReadService;

    test.beforeAll(async () => {
        // Crear un contexto de solicitud API
        apiContext = await playwrightRequest.newContext({
            baseURL: process.env.URL,
            extraHTTPHeaders: {
                "Content-Type": "application/json",
            },
        });

        // Inicializar LoginService con el contexto de solicitud
        bookingReadService = new BookingReadService(apiContext);
    });

    testListBooking.forEach((booking, index) => { 
        test(`Validar al read con el Token del Excel - Caso ${index + 1}`, async () => {
            let isValidatoJson: boolean = false;
            await test.step("Consumir el servicio con token", async () => {
                await bookingReadService.consumeService(testDataToken[0].token, `${booking.bookingid}`);
            });
            // Consumir el servicio con los datos del Excel
            const response = bookingReadService.responsePlaywright;
            const responseData = await response.json();
            const isBooking = bookingReadService.booking && Object.keys(bookingReadService.booking).length > 0 ? true : false;

            await test.step("Reportar el resultado de la prueba", async () => {
                isValidatoJson = bookingReadService.validatorJsonSchema(responseData);
                bookingReadService.reportEnd(
                    bookingReadService.responsePlaywright.status(),
                    bookingReadService.booking,
                    isBooking
                );
            });
            
            await test.step("Validar la respuesta del servicio", async () => {
                const isValidBookingid = bookingReadService.booking === booking.bookingid;

                expect(response.status()).toBe(200);
                expect(isValidatoJson).toBe(true);
                expect(isValidBookingid).toBe(true);
            });
        });
    })

    test.afterAll(async () => {
        // Cerrar el contexto de solicitud
        await apiContext.dispose();
    });
});

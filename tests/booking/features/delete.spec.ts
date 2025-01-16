import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import * as fs from 'fs';
import path from 'path';

import { BookingDeleteService } from "@booking/application";
import { IBookingDeleteService } from "@booking/ports";

const dataPathToken = path.resolve(__dirname, '../../json/testDataToken.json');
const testDataToken: Record<string, any>[] = JSON.parse(fs.readFileSync(dataPathToken, 'utf-8'));

const dataPathBooking = path.resolve(__dirname, '../../json/testDataBookingList.json');
const testListBooking: Record<string, any>[] = JSON.parse(fs.readFileSync(dataPathBooking, 'utf-8'));

test.describe("List API Test Suite", () => {
    let apiContext: APIRequestContext;
    let bookingDeleteService: IBookingDeleteService;

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
    });

    testListBooking.forEach((booking, index) => {
        test(`Validar al delete con el Token del Excel - Caso ${index + 1}`, async () => {
            await test.step("Consumir el servicio con token", async () => {
                await bookingDeleteService.consumeService(testDataToken[0].token, `${booking.bookingid}`);
            });
            // Consumir el servicio con los datos del Excel
            const response = bookingDeleteService.responsePlaywright;

            await test.step("Reportar el resultado de la prueba", async () => {
                bookingDeleteService.reportEnd(
                    response.status(),
                    response.status(),
                    (response.status() === 202) ? true : false
                );
            });

            await test.step("Validar la respuesta del servicio", async () => {
                expect(response.status()).toBe(202);
            });
        });
    })

    test.afterAll(async () => {
        // Cerrar el contexto de solicitud
        await apiContext.dispose();
    });
});

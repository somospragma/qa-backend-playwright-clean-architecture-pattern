import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";

import * as fs from 'fs';
import path from 'path';

import { BookingUpdateService } from "@booking/application";
import { IBooking, IBookingDates, IBookingUpdateService } from "@booking/ports";

const dataPathToken = path.resolve(__dirname, '../../json/testDataToken.json');
const testDataToken: Record<string, any>[] = JSON.parse(fs.readFileSync(dataPathToken, 'utf-8'));

const dataPathBooking = path.resolve(__dirname, '../../json/testDataBooking.json');
const testDataBooking: Record<string, any>[] = JSON.parse(fs.readFileSync(dataPathBooking, 'utf-8'));

test.describe("List API Test Suite", () => {
    let apiContext: APIRequestContext;
    let bookingCreateService: IBookingUpdateService;

    test.beforeAll(async () => {
        apiContext = await playwrightRequest.newContext({
            baseURL: process.env.URL,
            extraHTTPHeaders: {
                "Content-Type": "application/json",
            },
        });

        bookingCreateService = new BookingUpdateService(apiContext);
    });

    testDataBooking.forEach((booking, index) => {
        test(`Validar el update con el Token del Excel - Caso ${index + 1}`, async () => {
            let dataBooking: IBooking = {} as IBooking;
            let isValidBooking: boolean = false;
            let isValidatoJson: boolean = false;
            await test.step("Consumir el servicio con token", async () => {
                const bookingdates: IBookingDates = {
                    checkin: booking.checkin,
                    checkout: booking.checkout,
                };
                const data: IBooking = {
                    bookingid: booking.bookingid,
                    roomid: booking.roomid,
                    firstname: booking.firstname,
                    lastname: booking.lastname,
                    depositpaid: booking.depositpaid,
                    bookingdates: bookingdates,
                }
                dataBooking = data;
                await bookingCreateService.consumeService(testDataToken[0].token, data);
            });

            const responseData = await bookingCreateService.responsePlaywright.json();
            const isBooking = bookingCreateService.booking && Object.keys(bookingCreateService.booking).length > 0 ? true : false;
            
            await test.step("Reportar el resultado de la prueba", async () => {
                isValidBooking = bookingCreateService.validateBookingData(dataBooking);
                isValidatoJson = bookingCreateService.validatorJsonSchema(responseData);
                bookingCreateService.reportEnd(
                    bookingCreateService.responsePlaywright.status(),
                    bookingCreateService.booking,
                    isBooking
                );
            });

            await test.step("Validar la respuesta del servicio", async () => {
                expect(isValidatoJson).toBe(true);
                expect(isValidBooking).toBe(true);
                expect(bookingCreateService.responsePlaywright.status()).toBe(200);
            });
        });
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });
});

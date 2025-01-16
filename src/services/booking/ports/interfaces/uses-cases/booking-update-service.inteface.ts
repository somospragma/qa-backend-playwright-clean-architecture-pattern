import { IBooking, IBookingResponse } from "@booking/ports";
import { APIResponse } from "@playwright/test";

export interface IBookingUpdateService {
    get responsePlaywright(): APIResponse;
    get booking(): IBookingResponse;

    consumeService(token: string, booking: IBooking): Promise<void>;
    
    validatorJsonSchema(bodyResponse: { [key: string]: string; }): boolean;

    validateBookingData(booking: IBooking): boolean;

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void;
}
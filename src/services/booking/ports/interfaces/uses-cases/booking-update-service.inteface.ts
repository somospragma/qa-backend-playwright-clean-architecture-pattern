import { IBooking, IBookingCreate } from "@booking/ports";
import { APIResponse } from "@playwright/test";

export interface IBookingUpdateService {
    get responsePlaywright(): APIResponse;
    get booking(): IBookingCreate;

    consumeService(token: string, booking: IBooking): Promise<void>;
    
    validatorJsonSchema(bodyResponse: { [key: string]: string; }): boolean;

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void;
}
import { IBooking } from "@booking/ports";
import { APIResponse } from "@playwright/test";

export interface IBookingReadService {
    get responsePlaywright(): APIResponse;
    get booking(): IBooking;

    consumeService(token: string, roomid: string): Promise<void>;

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void;

    validatorJsonSchema(bodyResponse: { [key: string]: string; }): boolean;
}

import { IBookingList } from "@booking/ports";
import { APIResponse } from "@playwright/test";

export interface IBookingListService {
    get responsePlaywright(): APIResponse;
    get listBooking(): IBookingList;

    consumeService(token: string, roomid: string): Promise<void>;

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void;

    validatorJsonSchema(bodyResponse: { [key: string]: string; }): boolean;
}

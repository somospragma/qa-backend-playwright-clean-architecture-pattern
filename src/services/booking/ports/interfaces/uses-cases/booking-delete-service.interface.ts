import { APIResponse } from "@playwright/test";

export interface IBookingDeleteService {
    get responsePlaywright(): APIResponse;
    
    consumeService(token: string, roomid: string): Promise<void>;

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void;

    validatorJsonSchema(bodyResponse: { [key: string]: string; }): boolean;
}

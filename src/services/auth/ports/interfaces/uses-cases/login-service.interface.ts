import { APIResponse } from "@playwright/test";

import { ILogin } from "@auth/ports";

export interface ILoginService {
    responsePlaywright: APIResponse;
    token: string | null;

    consumeService(data: ILogin): Promise<void>;

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void
}
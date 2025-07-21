import { APIResponse } from "@playwright/test";
import { IPost } from "@posts/ports";

export interface IPostDeleteService {
    get responsePlaywright(): APIResponse;
    get deletePost(): {};

    consumeService(id: number): Promise<void>;

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void;

    validatorJsonSchema(bodyResponse: { [key: string]: string; }): boolean;
}
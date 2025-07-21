import { APIResponse } from "@playwright/test";
import { IPost } from "@posts/ports";

export interface IPostListService {
    get responsePlaywright(): APIResponse;
    get listPost()          : IPost[];

    consumeService(): Promise<void>;

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void;

    validatorJsonSchema(bodyResponse: { [key: string]: string; }): boolean;
}
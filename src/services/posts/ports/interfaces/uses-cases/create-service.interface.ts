import { APIResponse } from "@playwright/test";
import { IPost } from "@posts/ports";

export interface IPostCreateService {
    get responsePlaywright(): APIResponse;
    get post()          : IPost;

    consumeService(post: IPost): Promise<void>;

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void;

    validatorJsonSchema(bodyResponse: { [key: string]: string; }): boolean;

    comparatorData(expected: IPost, received: IPost, identifier: string, savePath: string): void;
}
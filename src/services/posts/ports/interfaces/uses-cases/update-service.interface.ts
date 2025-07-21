import { APIResponse } from "@playwright/test";
import { IPost } from "@posts/ports";

export interface IPostUpdateService {
    get responsePlaywright(): APIResponse;
    get updatePost()        : IPost;

    consumeServicePUT(post: IPost, idList: number): Promise<void>;
    
    consumeServicePATCH<T>(post: T, idList: number): Promise<void>;

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void;

    validatorJsonSchema(bodyResponse: { [key: string]: string; }): boolean;

    comparatorData(expected: IPost, received: IPost, identifier: string, savePath: string): void;
}
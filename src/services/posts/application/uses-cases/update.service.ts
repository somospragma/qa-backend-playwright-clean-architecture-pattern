import { APIRequestContext, APIResponse } from "@playwright/test";
import {
    IDataComparatorHelper,
    IErrorHelper,
    IHttpHelper,
    IJSONSchema,
    ILoggerHelper,
    IResponseValidatorHelper
} from "@common/ports";
import {
    DataComparatorHelper,
    ErrorHelper,
    HttpHelper,
    LoggerHelper,
    ResponseValidatorHelper
} from "@common/domain/helpers";

import { IPost, IPostUpdateService, IValidatorJsonSchemaHelper } from "@posts/ports";
import { ValidatorJsonSchemaHelper } from "@posts/domain/helpers";

export class PostUpdateService implements IPostUpdateService {
    private readonly httpHelper: IHttpHelper;
    private readonly logger: ILoggerHelper = new LoggerHelper();
    private readonly errorHandler: IErrorHelper = new ErrorHelper();
    private readonly jsonValidator: IResponseValidatorHelper;
    private readonly comparator: IDataComparatorHelper<IPost> = new DataComparatorHelper<IPost>();
    private readonly jsonSchemaHelper: IValidatorJsonSchemaHelper = new ValidatorJsonSchemaHelper();

    private responseData: APIResponse = {} as APIResponse;
    private postResult: IPost = {} as IPost;

    public get responsePlaywright(): APIResponse {
        return this.responseData;
    }

    public get updatePost(): IPost {
        return this.postResult;
    }

    constructor(request: APIRequestContext) {
        this.httpHelper = new HttpHelper(request);
        const schema = this.jsonSchemaHelper.jsonSchemaResponseList200() as IJSONSchema;
        this.jsonValidator = new ResponseValidatorHelper(schema);
    }

    async consumeServicePUT(post: IPost, id: number): Promise<void> {
        await this.handleRequest("PUT", post, id);
    }

    async consumeServicePATCH<T>(partialPost: T, id: number): Promise<void> {
        await this.handleRequest("PATCH", partialPost, id);
    }

    private async handleRequest<T>(method: "PUT" | "PATCH", payload: T, id: number): Promise<void> {
        const url = process.env.URL;
        if (!url) {
            console.error("❌ No se encontró la URL base.");
            return;
        }

        const endpoint = `${url}posts/${id}`;
        this.logger.logRequest(method, endpoint, { "Content-Type": "application/json" }, payload);

        try {
            const response = method === "PUT"
                ? await this.httpHelper.httpPut(url, `posts/${id}`, payload)
                : await this.httpHelper.httpPatch(url, `posts/${id}`, payload);

            this.responseData = response;
            this.postResult = await response.json();
        } catch (error) {
            const { response: errResponse } = error as any;
            const status = errResponse?.status || 500;
            const data = errResponse?.data || { error: "Error desconocido" };
            this.logger.logResponse(status, data, false);
        }
    }

    validatorJsonSchema(bodyResponse: Record<string, any>): boolean {
        return this.jsonValidator.validateResponse(bodyResponse);
    }

    comparatorData(expected: IPost, received: IPost, identifier: string, savePath: string): void {
        this.comparator.compareAndLog(expected, received, identifier, savePath);
    }

    reportEnd<T>(status: number, responseData: T, success: boolean): void {
        this.logger.logResponse(status, responseData, success);
    }
}

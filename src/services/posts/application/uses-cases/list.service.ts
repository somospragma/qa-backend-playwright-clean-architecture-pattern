import { APIRequestContext, APIResponse } from "@playwright/test";

import { IErrorHelper, IHttpHelper, IJSONSchema, ILoggerHelper, IResponseValidatorHelper } from "@common/ports";
import { ErrorHelper, HttpHelper, LoggerHelper, ResponseValidatorHelper } from "@common/domain/helpers";

import { IPost, IPostListService, IValidatorJsonSchemaHelper } from "@posts/ports";
import { ValidatorJsonSchemaHelper } from "@posts/domain/helpers";

export class PostListService implements IPostListService {
    private httpHelper: IHttpHelper;
    private loggerHelper: ILoggerHelper = new LoggerHelper();
    private errorHelper: IErrorHelper = new ErrorHelper();
    private response: APIResponse = {} as APIResponse;
    private listPostResponse: IPost[] = [];
    private validatorJson: IResponseValidatorHelper;
    private jsonSchemaHelper: IValidatorJsonSchemaHelper = new ValidatorJsonSchemaHelper();

    public get responsePlaywright(): APIResponse {
        return this.response;
    }

    public get listPost(): IPost[] {
        return this.listPostResponse;
    }

    constructor(request: APIRequestContext) {
        this.httpHelper = new HttpHelper(request);
        this.validatorJson = new ResponseValidatorHelper(this.jsonSchemaHelper.jsonSchemaResponseList200() as IJSONSchema);
    }

    async consumeService(): Promise<void> {
        const url = process.env.URL;

        this.loggerHelper.logRequest("GET", `${url}posts`, { "Content-Type": "application/json" });
        if (url) {
            try {
                this.response = await this.httpHelper.httpGet(url, 'posts');
                this.listPostResponse = await this.response.json() ? await this.response.json() : [];
            } catch (error) {
                if (this.errorHelper.isHttpError(error)) {
                    this.loggerHelper.logResponse(
                        error.response?.status || 500,
                        error.response?.data || { error: "Error desconocido" },
                        false
                    );
                } else
                    this.loggerHelper.logResponse(500, { error: "Error no manejado" }, false);
            }
        } else console.log("No se encontró la URL correspondiente");
    }

    validatorJsonSchema(bodyResponse: { [key: string]: string; }): boolean {
        return this.validatorJson.validateResponse(bodyResponse);
    }

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void {
        this.loggerHelper.logResponse(status, dataresponse, isResult);
    }
}

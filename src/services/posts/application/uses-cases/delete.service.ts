import { APIRequestContext, APIResponse } from "@playwright/test";

import { IDataComparatorHelper, IErrorHelper, IHttpHelper, IJSONSchema, ILoggerHelper, IResponseValidatorHelper } from "@common/ports";
import { DataComparatorHelper, ErrorHelper, HttpHelper, LoggerHelper, ResponseValidatorHelper } from "@common/domain/helpers";

import { IPost, IPostDeleteService, IValidatorJsonSchemaHelper } from "@posts/ports";
import { ValidatorJsonSchemaHelper } from "@posts/domain/helpers";

export class PostDeleteService implements IPostDeleteService {
    private httpHelper: IHttpHelper;
    private loggerHelper: ILoggerHelper = new LoggerHelper();
    private errorHelper: IErrorHelper = new ErrorHelper();
    private response: APIResponse = {} as APIResponse;
    private deletePostResponse = {};
    private validatorJson: IResponseValidatorHelper;
    private jsonSchemaHelper: IValidatorJsonSchemaHelper = new ValidatorJsonSchemaHelper();
    private comparator: IDataComparatorHelper<IPost> = new DataComparatorHelper<IPost>();

    public get responsePlaywright(): APIResponse {
        return this.response;
    }

    public get deletePost(): {} {
        return this.deletePostResponse;
    }

    constructor(request: APIRequestContext) {
        this.httpHelper = new HttpHelper(request);
        this.validatorJson = new ResponseValidatorHelper(this.jsonSchemaHelper.jsonSchemaResponsePosts() as IJSONSchema);
    }

    async consumeService(id: number): Promise<void> {
        const url = process.env.URL;

        this.loggerHelper.logRequest("DELETE", `${url}posts/${id}`, { "Content-Type": "application/json" });
        if (url) {
            try {
                this.response = await this.httpHelper.httpDelete(url, `posts/${id}`);
                this.deletePostResponse = await this.response.json() ? await this.response.json() : [];
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

    comparatorData(expected: IPost, received: IPost, identifier: string, savePath: string): void {
        this.comparator.compareAndLog(expected, received, identifier, savePath);
    }

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void {
        this.loggerHelper.logResponse(status, dataresponse, isResult);
    }
}

import { APIRequestContext, APIResponse } from "@playwright/test";

import { IErrorHelper, IHttpHelper, ILoggerHelper, ITokenExtractorHelper } from "@common/ports";
import { ErrorHelper, HttpHelper, LoggerHelper, TokenExtractorHelper } from "@common/domain/helpers";

import { ILogin, ILoginService } from "@auth/ports";

export class LoginService implements ILoginService {
    private httpHelper: IHttpHelper;
    private loggerHelper: ILoggerHelper = new LoggerHelper();
    private errorHelper: IErrorHelper = new ErrorHelper();
    private tokenExtractorHelper: ITokenExtractorHelper = new TokenExtractorHelper();
    private response: APIResponse = {} as APIResponse;
    private tokenResponse: string | null = null;

    public get responsePlaywright(): APIResponse {
        return this.response;
    }
    
    public get token(): string | null {
        return this.tokenResponse;
    }

    constructor(request: APIRequestContext) {
        this.httpHelper = new HttpHelper(request)
    }

    async consumeService(data: ILogin): Promise<void> {
        const url = process.env.URL;
        const path = (process.env.Auth) ? `${process.env.Auth}login` : '';

        this.loggerHelper.logRequest("POST", `${url}${path}`, { "Content-Type": "application/json" }, data);
        if (url) {
            try {
                this.response = await this.httpHelper.httpPost(url, path, data);
                this.tokenResponse = this.tokenExtractorHelper.extractToken(this.response)
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
        } else {
            console.log("No se encontró la URL correspondiente");
        }
    }

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void {
        this.loggerHelper.logResponse(status, dataresponse, isResult);
    }
}

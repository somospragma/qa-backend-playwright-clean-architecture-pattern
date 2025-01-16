import { APIRequestContext, APIResponse } from "@playwright/test";

import { IErrorHelper, IHttpHelper, IJSONSchema, ILoggerHelper, IResponseValidatorHelper, ITokenExtractorHelper } from "@common/ports";
import { ErrorHelper, HttpHelper, LoggerHelper, ResponseValidatorHelper, TokenExtractorHelper } from "@common/domain/helpers";
import { IBookingDeleteService, IValidatorJsonSchemaHelper } from "@booking/ports";
import { ValidatorJsonSchemaHelper } from "@booking/domain/helpers";

export class BookingDeleteService implements IBookingDeleteService {
    private httpHelper: IHttpHelper;
    private loggerHelper: ILoggerHelper = new LoggerHelper();
    private errorHelper: IErrorHelper = new ErrorHelper();
    private response: APIResponse = {} as APIResponse;
    private validatoJson: IResponseValidatorHelper;
    private jsonSchemaHelper: IValidatorJsonSchemaHelper = new ValidatorJsonSchemaHelper();

    public get responsePlaywright(): APIResponse {
        return this.response;
    }

    constructor(request: APIRequestContext) {
        this.httpHelper = new HttpHelper(request);
        this.validatoJson = new ResponseValidatorHelper(this.jsonSchemaHelper.jsonSchemaResponseRead200() as IJSONSchema);
    }

    async consumeService(token: string, id: string): Promise<void> {

        const url = process.env.URL;
        const path = (process.env.Booking) ? `${process.env.Booking}${(id) ? id : ''}` : '';
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Cookie: `token=${token}`
        };

        console.log(`${url}${path}`);
        
        this.loggerHelper.logRequest("DELETE", `${url}${path}`, headers);
        if (url) {
            try {
                this.response = await this.httpHelper.httpDelete(url, path, headers);
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
        return this.validatoJson.validateResponse(bodyResponse);
    }

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void {
        this.loggerHelper.logResponse(status, dataresponse, isResult);
    }
}

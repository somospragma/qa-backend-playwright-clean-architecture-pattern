import { APIRequestContext, APIResponse } from "@playwright/test";

import { IErrorHelper, IHttpHelper, IJSONSchema, ILoggerHelper, IResponseValidatorHelper } from "@common/ports";
import { ErrorHelper, HttpHelper, LoggerHelper, ResponseValidatorHelper } from "@common/domain/helpers";
import { IBookingList, IBookingListService, IValidatorJsonSchemaHelper } from "@booking/ports";
import { ValidatorJsonSchemaHelper } from "@booking/domain/helpers";

export class BookingListService implements IBookingListService {
    private httpHelper: IHttpHelper;
    private loggerHelper: ILoggerHelper = new LoggerHelper();
    private errorHelper: IErrorHelper = new ErrorHelper();
    private response: APIResponse = {} as APIResponse;
    private listBookingResponse: IBookingList = {} as IBookingList;
    private validatoJson: IResponseValidatorHelper;
    private jsonSchemaHelper: IValidatorJsonSchemaHelper = new ValidatorJsonSchemaHelper();

    public get responsePlaywright(): APIResponse {
        return this.response;
    }

    public get listBooking(): IBookingList {
        return this.listBookingResponse;
    }

    constructor(request: APIRequestContext) {
        this.httpHelper = new HttpHelper(request);
        this.validatoJson = new ResponseValidatorHelper(this.jsonSchemaHelper.jsonSchemaResponseList200() as IJSONSchema);
    }

    async consumeService(token: string, roomid: string): Promise<void> {

        const url = process.env.URL;
        const query = `?roomid=${roomid}`;
        const path = (process.env.Booking) ? `${process.env.Booking}${(roomid) ? query : ''}` : '';
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Cookie: `token=${token}`
        };

        this.loggerHelper.logRequest("GET", `${url}${path}`, headers);
        if (url) {
            try {
                this.response = await this.httpHelper.httpGet(url, path, headers);
                this.listBookingResponse = (this.response.status() === 200) ? await this.response.json() : {};
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

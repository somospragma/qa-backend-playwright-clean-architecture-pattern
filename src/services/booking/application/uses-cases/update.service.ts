import { APIRequestContext, APIResponse } from "@playwright/test";

import { IErrorHelper, IHttpHelper, IJSONSchema, ILoggerHelper, IResponseValidatorHelper } from "@common/ports";
import { ErrorHelper, HttpHelper, LoggerHelper, ResponseValidatorHelper } from "@common/domain/helpers";
import { IBooking, IBookingResponse, IBookingUpdateService, IValidateBookingEntity, IValidatorJsonSchemaHelper } from "@booking/ports";
import { ValidatorJsonSchemaHelper } from "@booking/domain/helpers";
import { ValidateBookingEntity } from "@booking/domain/entities";

export class BookingUpdateService implements IBookingUpdateService {
    private httpHelper: IHttpHelper;
    private loggerHelper: ILoggerHelper = new LoggerHelper();
    private errorHelper: IErrorHelper = new ErrorHelper();
    private response: APIResponse = {} as APIResponse;
    private bookingResponse: IBookingResponse = {} as IBookingResponse;
    private validatoJson: IResponseValidatorHelper;
    private jsonSchemaHelper: IValidatorJsonSchemaHelper = new ValidatorJsonSchemaHelper();
    private validateBooking: IValidateBookingEntity = new ValidateBookingEntity();

    public get responsePlaywright(): APIResponse {
        return this.response;
    }

    public get booking(): IBookingResponse {
        return this.bookingResponse;
    }

    constructor(request: APIRequestContext) {
        this.httpHelper = new HttpHelper(request);
        this.validatoJson = new ResponseValidatorHelper(this.jsonSchemaHelper.jsonSchemaResponseCreate200() as IJSONSchema);
    }

    async consumeService(token: string, booking: IBooking): Promise<void> {

        const url = process.env.URL;
        const path = (process.env.Booking) ? `${process.env.Booking}${(booking.bookingid) ? booking.bookingid : ''}` : '';
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Cookie: `token=${token}`
        };

        this.loggerHelper.logRequest("PUT", `${url}${path}`, headers, booking);
        if (url) {
            try {
                this.response = await this.httpHelper.httpPut(url, path, booking, headers);
                this.bookingResponse = await this.response.json();
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

    validateBookingData(booking: IBooking): boolean {
        return this.validateBooking.validateBookingData(booking, this.bookingResponse.booking);
    }

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void {
        this.loggerHelper.logResponse(status, dataresponse, isResult);
    }
}

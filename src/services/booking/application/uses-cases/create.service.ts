import { APIRequestContext, APIResponse } from "@playwright/test";

import { IErrorHelper, IHttpHelper, IJSONSchema, ILoggerHelper, IResponseValidatorHelper } from "@common/ports";
import { ErrorHelper, HttpHelper, LoggerHelper, ResponseValidatorHelper } from "@common/domain/helpers";
import { IBooking, IBookingResponse, IBookingCreateService, IValidatorJsonSchemaHelper, IBookingDates } from "@booking/ports";
import { ValidatorJsonSchemaHelper } from "@booking/domain/helpers";

export class BookingCreateService implements IBookingCreateService {
    private httpHelper: IHttpHelper;
    private loggerHelper: ILoggerHelper = new LoggerHelper();
    private errorHelper: IErrorHelper = new ErrorHelper();
    private response: APIResponse = {} as APIResponse;
    private bookingResponse: IBookingResponse = {} as IBookingResponse;
    private validatoJson: IResponseValidatorHelper;
    private jsonSchemaHelper: IValidatorJsonSchemaHelper = new ValidatorJsonSchemaHelper();

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
        const path = (process.env.Booking) ? `${process.env.Booking}` : '';
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Cookie: `token=${token}`
        };

        this.loggerHelper.logRequest("GET", `${url}${path}`, headers, booking);
        if (url) {
            try {
                this.response = await this.httpHelper.httpPost(url, path, booking, headers);
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
        const receivedBooking = this.bookingResponse.booking;
    
        // Validación inicial: comprobar que los datos recibidos no están vacíos
        if (!receivedBooking || Object.keys(receivedBooking).length === 0) {
            console.log("❌ No se recibió ninguna respuesta para validar.");
            return false;
        }
    
        // Compara las claves y valores de los datos enviados y recibidos
        let isMatching = true;
        const differences: string[] = [];
    
        Object.keys(booking).forEach((key) => {
            // Omitir la validación de la propiedad 'bookingid'
            if (key === 'bookingid') return;
    
            const sentValue = booking[key as keyof IBooking];
            const receivedValue = receivedBooking[key as keyof IBooking];
    
            // Validar de forma recursiva las propiedades dentro de 'bookingdates'
            if (key === 'bookingdates') {
                const bookingDatesSent = sentValue as unknown as IBookingDates;
                const bookingDatesReceived = receivedValue as unknown as IBookingDates;
    
                Object.keys(bookingDatesSent).forEach((dateKey) => {
                    const sentDate = bookingDatesSent[dateKey as keyof IBookingDates];
                    const receivedDate = bookingDatesReceived[dateKey as keyof IBookingDates];
    
                    if (sentDate !== receivedDate) {
                        isMatching = false;
                        differences.push(
                            `Campo 'bookingdates.${dateKey}': enviado '${sentDate}', recibido '${receivedDate}'`
                        );
                    }
                });
            } else {
                // Normalizar valores antes de compararlos
                const normalizedSentValue = typeof sentValue === 'string' && !isNaN(Number(sentValue)) 
                    ? Number(sentValue) 
                    : sentValue === 'true' || sentValue === 'false'
                    ? sentValue === 'true'
                    : sentValue;
    
                if (normalizedSentValue !== receivedValue) {
                    isMatching = false;
                    differences.push(`Campo '${key}': enviado '${normalizedSentValue}', recibido '${receivedValue}'`);
                }
            }
        });
    
        // Mostrar resultados en consola
        if (isMatching) {
            console.log("✅ Los datos enviados coinciden correctamente con los datos recibidos.");
        } else {
            console.log("❌ Los datos no coinciden en los siguientes puntos:");
            differences.forEach((difference) => console.log(difference));
        }
    
        return isMatching;
    }    

    reportEnd<T>(status: number, dataresponse: T, isResult: boolean): void {
        this.loggerHelper.logResponse(status, dataresponse, isResult);
    }
}

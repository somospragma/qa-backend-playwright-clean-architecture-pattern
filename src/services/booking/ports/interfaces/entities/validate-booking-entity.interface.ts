import { IBooking } from "@booking/ports";

export interface IValidateBookingEntity {
    validateBookingData(booking: IBooking, receivedBooking: IBooking): boolean;
}

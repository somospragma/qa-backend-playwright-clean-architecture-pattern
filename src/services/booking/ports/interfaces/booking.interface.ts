import { IBookingDates } from "./booking-dates.interface";

export interface IBooking {
    bookingid:    number;
    roomid:       number;
    firstname:    string;
    lastname:     string;
    depositpaid:  boolean;
    bookingdates: IBookingDates;
}

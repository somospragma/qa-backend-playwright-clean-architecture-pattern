import { IValidatorJsonSchemaHelper } from "@booking/ports";

export class ValidatorJsonSchemaHelper implements IValidatorJsonSchemaHelper {

    jsonSchemaResponse200(): Object {
        return {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "title": "Generated schema for JsonT",
            "type": "object",
            "properties": {
                "bookings": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "bookingid": {
                                "type": "number"
                            },
                            "roomid": {
                                "type": "number"
                            },
                            "firstname": {
                                "type": "string"
                            },
                            "lastname": {
                                "type": "string"
                            },
                            "depositpaid": {
                                "type": "boolean"
                            },
                            "bookingdates": {
                                "type": "object",
                                "properties": {
                                    "checkin": {
                                        "type": "string"
                                    },
                                    "checkout": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "checkin",
                                    "checkout"
                                ]
                            }
                        },
                        "required": [
                            "bookingid",
                            "roomid",
                            "firstname",
                            "lastname",
                            "depositpaid",
                            "bookingdates"
                        ]
                    }
                }
            },
            "required": [
                "bookings"
            ]
        };
    }
}

import { IValidatorJsonSchemaHelper } from "@posts/ports";

export class ValidatorJsonSchemaHelper implements IValidatorJsonSchemaHelper {

    jsonSchemaResponseList200(): object {
        return {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "title": "Generated schema for JsonT",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "userId": {
                        "type": "number"
                    },
                    "id": {
                        "type": "number"
                    },
                    "title": {
                        "type": "string"
                    },
                    "body": {
                        "type": "string"
                    }
                },
                "required": [
                    "userId",
                    "id",
                    "title",
                    "body"
                ]
            }
        };
    }

    jsonSchemaResponsePosts(): object {
        return {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "title": "Generated schema for JsonT",
            "type": "object",
            "properties": {
                "title": {
                    "type": "string"
                },
                "body": {
                    "type": "string"
                },
                "userId": {
                    "type": "number"
                },
                "id": {
                    "type": "number"
                }
            },
            "required": [
                "title",
                "body",
                "userId",
                "id"
            ]
        };
    }

    jsonSchemaResponseDelete200(): object {
        return {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "title": "Generated schema for JsonT",
            "type": "object",
            "properties": {},
            "required": []
        };
    }
}

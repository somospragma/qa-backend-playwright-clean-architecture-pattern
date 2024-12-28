import { IErrorHelper } from "@common/ports";

export class ErrorHelper implements IErrorHelper {

    isHttpError(error: unknown): error is { response?: { status: number; data: any } } {
        return (
            typeof error === "object" &&
            error !== null &&
            "response" in error &&
            typeof (error as any).response === "object"
        );
    }
}
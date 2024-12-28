export interface IErrorHelper {
    isHttpError(error: unknown): error is { response?: { status: number; data: any } };
}

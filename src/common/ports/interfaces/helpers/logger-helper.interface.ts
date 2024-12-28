export interface ILoggerHelper {
    /**
     * Logs the details of the request being sent.
     * @param method HTTP method (e.g., GET, POST)
     * @param endpoint Endpoint being called
     * @param headers Headers of the request
     * @param body Body of the request (optional)
     */
    logRequest<T>(method: string, endpoint: string, headers: Record<string, string>, body?: T): void;

    /**
     * Logs the details of the response received and the test result.
     * @param statusCode HTTP status code of the response
     * @param responseBody Body of the response
     * @param testPassed Boolean indicating if the test passed
     */
    logResponse<T>(statusCode: number, responseBody: T, testPassed: boolean): void;
}
import { APIResponse } from "@playwright/test";

export interface IHttpHelper {
    /**
     * Method by which the post request is made
     * @param baseUrl string
     * @param path string
     * @param data T
     * @returns Promise APIResponse
     */
    httpPost<T>(baseUrl: string, path: string, data: T, headers?: { [key: string]: string; } | undefined): Promise<APIResponse>;

    /**
     * Method by which the get request is made
     * @param baseUrl string
     * @param path string
     * @param token { [key: string]: string; } | undefined
     * @returns Promise APIResponse
     */
    httpGet(baseUrl: string, path: string, headers?: { [key: string]: string; } | undefined): Promise<APIResponse>;

    /**
     * Method by which the patch request is made
     * @param baseUrl string
     * @param path string
     * @param data T
     * @returns Promise APIResponse
     */
    httpPatch<T>(baseUrl: string, path: string, data: T): Promise<APIResponse>;

    /**
     * Method by which the delete request is made
     * @param baseUrl string
     * @param path string
     * @param data T
     * @returns Promise APIResponse
     */
    httpDelete<T>(baseUrl: string, path: string, headers?: { [key: string]: string; } | undefined): Promise<APIResponse>;

    /**
     * Method by which the put request is made
     * @param baseUrl string
     * @param path string
     * @param data T
     * @param headers { [key: string]: string; } | undefined
     * @returns Promise APIResponse
     */
    httpPut<T>(baseUrl: string, path: string, data: T, headers?: { [key: string]: string; } | undefined): Promise<APIResponse>;
}

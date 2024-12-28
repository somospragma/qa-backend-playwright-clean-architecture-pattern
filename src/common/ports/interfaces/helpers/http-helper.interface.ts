import { APIResponse } from "@playwright/test";

export interface IHttpHelper {
    /**
     * Method by which the post request is made
     * @param baseUrl string
     * @param path string
     * @param data T
     * @returns Promise APIResponse
     */
    httpPost<T>(baseUrl: string, path: string, data: T): Promise<APIResponse>;

    /**
     * Method by which the get request is made
     * @param baseUrl string
     * @param path string
     * @param data T
     * @returns Promise APIResponse
     */
    httpGet<T>(baseUrl: string, path: string, data: T): Promise<APIResponse>;

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
    httpDelete<T>(baseUrl: string, path: string, data: T): Promise<APIResponse>;

    /**
     * Method by which the put request is made
     * @param baseUrl string
     * @param path string
     * @param data T
     * @returns Promise APIResponse
     */
    httpPut<T>(baseUrl: string, path: string, data: T): Promise<APIResponse>;
}

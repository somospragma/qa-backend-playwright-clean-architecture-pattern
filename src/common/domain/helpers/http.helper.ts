import { APIRequestContext } from "@playwright/test";

import { IHttpHelper } from "@common/ports";

export class HttpHelper implements IHttpHelper {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async httpPost<T>(baseUrl: string, path: string, data: T) {
        return await this.request.post(`${baseUrl}${path}`, {
            data: data
        });
    };

    async httpGet(baseUrl: string, path: string, headers?: { [key: string]: string; } | undefined) {
        return await this.request.get(`${baseUrl}${path}`, { headers });
    };

    async httpPatch<T>(baseUrl: string, path: string, data: T) {
        return await this.request.patch(`${baseUrl}${path}`, {
            data: data
        });
    };

    async httpDelete<T>(baseUrl: string, path: string, data: T) {
        return await this.request.delete(`${baseUrl}${path}`, {
            data: data
        });
    };

    async httpPut<T>(baseUrl: string, path: string, data: T) {
        return await this.request.put(`${baseUrl}${path}`, {
            data: data
        });
    };
}
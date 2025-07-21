import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import { PostListService } from "@posts/application";

import * as fs from "fs";
import path from "path";
import { IPost, IPostListService } from "@posts/ports";

test.describe("Posts List API Test Suite", () => {
    let postListService: IPostListService;
    let apiContext: APIRequestContext;

    test.beforeAll(async () => {
        apiContext = await playwrightRequest.newContext({
            baseURL: process.env.URL,
            extraHTTPHeaders: {
                "Content-Type": "application/json",
            },
        });

        postListService = new PostListService(apiContext);
    });

    test(`Validar la lista de posts`, async () => {
        let responseStatus = 0;
        let postList: IPost[] = [];

        await test.step("Consumir el servicio de lista posts", async () => {
            await postListService.consumeService();

            responseStatus = postListService.responsePlaywright.status();
            postList = postListService.listPost;

            // 📁 Guardar la respuesta en un archivo JSON
            const outputPath = path.resolve(__dirname, "../../json/data/postListResponse.json");
            fs.writeFileSync(outputPath, JSON.stringify(postList, null, 2), "utf-8");

            // Reportar resultados
            postListService.reportEnd(responseStatus, postList, postList ? true : false);
        });

        await test.step("Validar el token extraído", async () => {
            expect(responseStatus).toBe(200);
            expect(postList).not.toBeNull();
        });
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });
});

import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import * as fs from "fs";
import path from "path";

import { IPost, IPostCreateService } from "@posts/ports";
import { PostCreateService } from "@posts/application";

const dataPath = path.resolve(__dirname, "../../json/data/testDataPosts.json");
const testData: Record<string, any>[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

const failedPath = path.resolve(__dirname, "../../json/results/failedComparisons");
if (!fs.existsSync(failedPath)) {
    fs.mkdirSync(failedPath, { recursive: true });
}

test.describe("Posts create API Test Suite", () => {
    let postCreateService: IPostCreateService;
    let apiContext: APIRequestContext;

    test.beforeAll(async () => {
        apiContext = await playwrightRequest.newContext({
            baseURL: process.env.URL,
            extraHTTPHeaders: {
                "Content-Type": "application/json",
            },
        });

        postCreateService = new PostCreateService(apiContext);
    });

    testData.forEach((postDataRaw, index) => {
        const postData = postDataRaw as IPost;

        test(`Validar creación del post #${index + 1}`, async () => {
            let responseStatus = 0;
            let postCreate: IPost = {} as IPost;
            let success = false;

            await test.step("Consumir servicio de creación", async () => {
                try {
                    await postCreateService.consumeService(postData);
                    responseStatus = postCreateService.responsePlaywright.status();
                    postCreate = postCreateService.post;
                    success = responseStatus === 201;
                } catch (error) {
                    console.error(`❌ Error en creación del post #${index + 1}:`, (error as Error).message);
                    responseStatus = 0;
                }

                postCreateService.reportEnd(responseStatus, postCreate, success);
            });

            await test.step("Validar status de respuesta", async () => {
                expect(responseStatus).toBe(201);
                expect(postCreate).not.toBeNull();
            });

            await test.step("Comparar datos enviados con los recibidos", async () => {
                const savePath = path.resolve(__dirname, "../../../../json/results/postComparisons");
                postCreateService.comparatorData(postData, postCreate, `post-${index + 1}`, savePath);
            });
        });
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });
});

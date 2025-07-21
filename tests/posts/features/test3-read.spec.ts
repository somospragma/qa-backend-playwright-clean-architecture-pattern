import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import { PostReadService } from "@posts/application";
import * as fs from "fs";
import path from "path";
import { IPost, IPostReadService } from "@posts/ports";

function getRandomSample<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

test.describe("Posts read API Test Suite", () => {
    let postReadService: IPostReadService;
    let apiContext: APIRequestContext;

    test.beforeAll(async () => {
        apiContext = await playwrightRequest.newContext({
            baseURL: process.env.URL,
            extraHTTPHeaders: {
                "Content-Type": "application/json",
            },
        });

        postReadService = new PostReadService(apiContext);
    });

    const savedPostsPath = path.resolve(__dirname, "../../json/data/postListResponse.json");
    const savedPosts: IPost[] = JSON.parse(fs.readFileSync(savedPostsPath, "utf-8"));
    const samplePosts = getRandomSample(savedPosts, 5);

    samplePosts.forEach((postData, index) => {
        test(`Validar lectura y consistencia del post #${index + 1}`, async () => {
            let responseStatus = 0;
            let postRead: IPost = {} as IPost;
            let success = false;

            await test.step("Consumir servicio GET /posts/:id", async () => {
                try {
                    await postReadService.consumeService(postData.id);
                    responseStatus = postReadService.responsePlaywright.status();
                    postRead = postReadService.readPost;
                    success = responseStatus === 200;
                } catch (error) {
                    console.error(`❌ Error en lectura del post #${index + 1}:`, (error as Error).message);
                    responseStatus = 0;
                }
                postReadService.reportEnd(responseStatus, postRead, success);
            });

            await test.step("Validar status de respuesta", async () => {
                expect(responseStatus).toBe(200);
                expect(postRead).not.toBeNull();
            });

            await test.step("Comparar datos enviados con los recibidos", async () => {
                const savePath = path.resolve(__dirname, "../../../../json/results/postComparisons");
                postReadService.comparatorData(postData, postRead, `post-${index + 1}`, savePath);
            });
        });
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });
});

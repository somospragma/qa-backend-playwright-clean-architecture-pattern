import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import * as fs from "fs";
import path from "path";
import { PostDeleteService } from "@posts/application";
import { IPost, IPostDeleteService } from "@posts/ports";

function getRandomSample<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

test.describe("Posts delete API Test Suite", () => {
    let postDeleteService: IPostDeleteService;
    let apiContext: APIRequestContext;

    test.beforeAll(async () => {
        apiContext = await playwrightRequest.newContext({
            baseURL: process.env.URL,
            extraHTTPHeaders: {
                "Content-Type": "application/json",
            },
        });

        postDeleteService = new PostDeleteService(apiContext);
    });

    const savedPostsPath = path.resolve(__dirname, "../../json/data/postListResponse.json");
    const savedPosts: IPost[] = JSON.parse(fs.readFileSync(savedPostsPath, "utf-8"));
    const samplePosts = getRandomSample(savedPosts, 5);

    samplePosts.forEach((postData, index) => {
        test(`Validar la eliminación del post #${index + 1}`, async () => {
            let responseStatus = 0;
            let postDelete = {};
            let success = false;

            await test.step("Consumir servicio DELETE /posts/:id", async () => {
                try {
                    await postDeleteService.consumeService(postData.id);
                    responseStatus = postDeleteService.responsePlaywright.status();
                    postDelete = postDeleteService.deletePost;
                    success = responseStatus === 200;
                } catch (error) {
                    console.error(`❌ Error en la eliminación del post #${index + 1}:`, (error as Error).message);
                    responseStatus = 0;
                }
                postDeleteService.reportEnd(responseStatus, postDelete, success);
            });

            await test.step("Validar status de respuesta", async () => {
                expect(responseStatus).toBe(200);
                expect(postDelete).not.toBeNull();
            });
        });
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });
});

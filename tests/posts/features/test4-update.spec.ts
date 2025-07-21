import { test, expect, APIRequestContext, request as playwrightRequest } from "@playwright/test";
import * as fs from "fs";
import path from "path";
import { IPost, IPostUpdateService } from "@posts/ports";
import { PostUpdateService } from "@posts/application";

// Cargar data solo una vez antes de declarar tests
const testDataPath = path.resolve(__dirname, "../../json/data/testDataPosts.json");
const savedPostsPath = path.resolve(__dirname, "../../json/data/postListResponse.json");
const testData: IPost[] = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
const savedPosts: IPost[] = JSON.parse(fs.readFileSync(savedPostsPath, "utf-8"));

function pickRandomIndexes<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function splitArrayInTwo<T>(array: T[]): [T[], T[]] {
    const middle = Math.ceil(array.length / 2);
    const putIndexes = array.slice(0, middle);
    const patchIndexes = array.slice(middle);
    return [putIndexes, patchIndexes];
}

// Seleccionar N índices aleatorios para PUT
const newListPost = pickRandomIndexes(savedPosts, testData.length * 2);

const [putIndexes, patchIndexes ] = splitArrayInTwo(newListPost);

const failedPath = path.resolve(__dirname, "../../json/results/failedComparisons");
if (!fs.existsSync(failedPath)) {
    fs.mkdirSync(failedPath, { recursive: true });
}

test.describe("Posts Update API Test Suite", () => {

    let postUpdateService: IPostUpdateService;
    let apiContext: APIRequestContext;

    test.beforeAll(async () => {
        apiContext = await playwrightRequest.newContext({
            baseURL: process.env.URL,
            extraHTTPHeaders: {
                "Content-Type": "application/json",
            },
        });
        postUpdateService = new PostUpdateService(apiContext);
    });

    // PUT tests
    putIndexes.forEach((dataIdx, testIdx) => {
        const postData = testData[testIdx];
        const idToUpdate = savedPosts[dataIdx.id]?.id;

        test(`PUT - Actualización completa del post #${testIdx + 1}`, async () => {
            let responseStatus = 0;
            let postUpdated: IPost = {} as IPost;

            await test.step("Consumir PUT con datos completos", async () => {
                await postUpdateService.consumeServicePUT(postData, idToUpdate);
                responseStatus = postUpdateService.responsePlaywright.status();
                postUpdated = postUpdateService.updatePost;
                postUpdateService.reportEnd(responseStatus, postUpdated, responseStatus === 200);
            });

            await test.step("Validar respuesta PUT", async () => {
                expect(responseStatus).toBe(200);
                expect(postUpdated).not.toBeNull();
            });

            await test.step("Comparar datos PUT", async () => {
                const savePath = path.resolve(__dirname, "../../../../json/results/postComparisons");
                postUpdateService.comparatorData(postData, postUpdated, `put-${idToUpdate}`, savePath);
            });
        });
    });

    // PATCH tests
    patchIndexes.forEach((dataIdx, testIdx) => {
        const postData = testData[testIdx];
        const idToUpdate = savedPosts[dataIdx.id]?.id;
        const keys: (keyof IPost)[] = ["userId", "title", "body"];
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const partialData: Partial<IPost> = {
            [randomKey]: postData[randomKey],
        };

        test(`PATCH - Actualización parcial del post ID #${testIdx + 1}`, async () => {
            let responseStatus = 0;
            let postUpdated: IPost = {} as IPost;

            await test.step(`Consumir PATCH con propiedad: ${randomKey}`, async () => {
                await postUpdateService.consumeServicePATCH(partialData, idToUpdate);
                responseStatus = postUpdateService.responsePlaywright.status();
                postUpdated = postUpdateService.updatePost;
                postUpdateService.reportEnd(responseStatus, postUpdated, responseStatus === 200);
            });

            await test.step("Validar respuesta PATCH", async () => {
                expect(responseStatus).toBe(200);
                expect(postUpdated).not.toBeNull();
            });

            await test.step("Comparar campo modificado en PATCH", async () => {
                const expectedValue = postData[randomKey];
                const receivedValue = postUpdated[randomKey];
                const savePath = path.resolve(__dirname, "../../../../json/results/postComparisons");

                if (expectedValue !== receivedValue) {
                    const mismatch = {
                        expected: { [randomKey]: expectedValue },
                        received: { [randomKey]: receivedValue },
                    };
                    const fileName = `patch-failed-${randomKey}-${idToUpdate}.json`;
                    const outputPath = path.join(savePath, fileName);
                    fs.writeFileSync(outputPath, JSON.stringify(mismatch, null, 2), "utf-8");
                    console.warn(`❌ Diferencias detectadas en PATCH. Guardado en: ${fileName}`);
                } else {
                    console.log(`✅ PATCH exitoso. Campo ${randomKey} actualizado correctamente.`);
                }

                expect(receivedValue).toBe(expectedValue);
            });
        });
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });
});

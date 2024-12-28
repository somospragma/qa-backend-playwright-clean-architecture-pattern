import { ITokenExtractorHelper } from "@common/ports";
import { APIResponse } from "@playwright/test";

export class TokenExtractorHelper implements ITokenExtractorHelper {
    extractToken(response: APIResponse): string | null {
        const setCookieHeader = response.headers()["set-cookie"]; // Obtener el encabezado Set-Cookie

        if (setCookieHeader) {
            // Buscar el token dentro del encabezado Set-Cookie
            const match = setCookieHeader.match(/token=([^;]+);/);
            if (match) {
                return match[1]; // Retornar el valor del token
            }
        }

        return null; // Retornar null si no se encuentra el token
    }
}
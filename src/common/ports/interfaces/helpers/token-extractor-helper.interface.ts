import { APIResponse } from "@playwright/test";

export interface ITokenExtractorHelper {
    /**
     * Extrae el token del encabezado Set-Cookie de una respuesta.
     * @param APIResponse Respuesta de la API.
     * @returns Token extraído o null si no se encuentra.
     */
    extractToken(response: APIResponse): string | null
}

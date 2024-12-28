import { ILoggerHelper } from "@common/ports";

export class LoggerHelper implements ILoggerHelper {
  private formatMessage(message: string, icon: string): string {
    return `${icon} ${message}`;
  }

  logRequest<T>(method: string, endpoint: string, headers: Record<string, string>, body?: T): void {
    console.log(this.formatMessage(`Solicitud enviada:`, "🚀"));
    console.log(`🔹 Método: ${method}`);
    console.log(`🔹 Endpoint: ${endpoint}`);
    console.log(`🔹 Headers:`);
    console.table(headers);
    if (body) {
      console.log(`🔹 Body:`);
      console.dir(body, { depth: null });
    }
    console.log("---------------------------------------------------");
  }

  logResponse<T>(statusCode: number, responseBody: T, testPassed: boolean): void {
    const resultIcon = testPassed ? "✅" : "❌";
    const resultMessage = testPassed ? "Prueba PASÓ exitosamente." : "Prueba FALLÓ.";

    console.log(this.formatMessage(`Respuesta recibida:`, "📥"));
    console.log(`🔹 Código de estado: ${statusCode}`);
    console.log(`🔹 Respuesta:`);
    console.dir(responseBody, { depth: null });
    console.log(`🔹 Resultado: ${resultIcon} ${resultMessage}`);
    console.log("---------------------------------------------------");
  }
}

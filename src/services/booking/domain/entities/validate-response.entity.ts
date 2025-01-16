import { IBooking, IBookingDates, IValidateBookingEntity } from "@booking/ports";

export class ValidateBookingEntity implements IValidateBookingEntity {

    validateBookingData(booking: IBooking, receivedBooking: IBooking): boolean {
        
        // Validación inicial: comprobar que los datos recibidos no están vacíos
        if (!receivedBooking || Object.keys(receivedBooking).length === 0) {
            console.log("❌ No se recibió ninguna respuesta para validar.");
            return false;
        }

        // Compara las claves y valores de los datos enviados y recibidos
        let isMatching = true;
        const differences: string[] = [];

        Object.keys(booking).forEach((key) => {
            // Omitir la validación de la propiedad 'bookingid'
            if (key === 'bookingid') return;

            const sentValue = booking[key as keyof IBooking];
            const receivedValue = receivedBooking[key as keyof IBooking];

            // Validar de forma recursiva las propiedades dentro de 'bookingdates'
            if (key === 'bookingdates') {
                const bookingDatesSent = sentValue as unknown as IBookingDates;
                const bookingDatesReceived = receivedValue as unknown as IBookingDates;

                Object.keys(bookingDatesSent).forEach((dateKey) => {
                    const sentDate = bookingDatesSent[dateKey as keyof IBookingDates];
                    const receivedDate = bookingDatesReceived[dateKey as keyof IBookingDates];

                    if (sentDate !== receivedDate) {
                        isMatching = false;
                        differences.push(
                            `Campo 'bookingdates.${dateKey}': enviado '${sentDate}', recibido '${receivedDate}'`
                        );
                    }
                });
            } else {
                // Normalizar valores antes de compararlos
                const normalizedSentValue = typeof sentValue === 'string' && !isNaN(Number(sentValue))
                    ? Number(sentValue)
                    : sentValue === 'true' || sentValue === 'false'
                        ? sentValue === 'true'
                        : sentValue;

                if (normalizedSentValue !== receivedValue) {
                    isMatching = false;
                    differences.push(`Campo '${key}': enviado '${normalizedSentValue}', recibido '${receivedValue}'`);
                }
            }
        });

        // Mostrar resultados en consola
        if (isMatching) {
            console.log("✅ Los datos enviados coinciden correctamente con los datos recibidos.");
        } else {
            console.log("❌ Los datos no coinciden en los siguientes puntos:");
            differences.forEach((difference) => console.log(difference));
        }

        return isMatching;
    }
}
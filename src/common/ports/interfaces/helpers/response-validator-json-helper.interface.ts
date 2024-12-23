export interface IResponseValidatorHelper {
    
    /**
     * Method to validate the bodyResponse according to the defined schema
     * @param bodyResponse - { [key: string]: string }
     * @returns boolean
     */
    validateResponse(bodyResponse: { [key: string]: string }): boolean;
}
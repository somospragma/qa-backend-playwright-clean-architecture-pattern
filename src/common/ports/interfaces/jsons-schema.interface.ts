export interface IJSONSchema {
    type: string;
    properties: {
        [key: string]: {
            type: string;
        };
    };
    required: string[];
};

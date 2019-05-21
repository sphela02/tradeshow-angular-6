 
    export interface ValidationResponse<T> { 
        Success: boolean;
        Message: string;
        Result: T;
    }
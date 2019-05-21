 
    export interface QueryParams { 
        Skip: number;
        Size: number;
        Filters: FilterParams[];
        Sort: SortParams[];
    } 
    export interface FilterParams { 
        Field: string;
        Operator: string;
        Value: string;
    } 
    export interface SortParams { 
        Desc: boolean;
        Field: string;
    }
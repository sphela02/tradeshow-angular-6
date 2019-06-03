import { AttendeeStatus } from "./Enums";

    export interface AttendeeEvent { 
        ID: number;
        Name: string;
        Username: string;
        DelegateName: string;
        DelegateUsername: string;
        EventID: number;
        EventName: string;
        StartDate: Date;
        EndDate: Date;
        Status: AttendeeStatus;
        IsComplete: boolean;
    }
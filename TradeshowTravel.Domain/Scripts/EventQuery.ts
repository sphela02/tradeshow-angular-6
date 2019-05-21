 
    export interface EventQueryResult { 
        Total: number;
        Events: EventItem[];
        Upcoming: number;
        Past: number;
        Segments: { [key: string]: number; };
    } 
    export interface EventItem { 
        ID: number;
        Name: string;
        StartDate: Date;
        Segments: string;
        OwnerUsername: string;
        OwnerName: string;
        EstAttendeeCount: number;
        ActAttendeeCount: number;
        Status: string;
    }
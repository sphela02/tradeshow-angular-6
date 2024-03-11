import { EventAttendee } from "./EventAttendee";

export interface EventAttendeeQueryResult { 
    Total: number;
    Attendees: EventAttendee[];
    Hotel: number;
    RSVPD: EventAttendeeRSVPD;
    Completed: number;
    Segments: { [key: string]: number; };
}

export interface EventAttendeeRSVPD {
    Yes: number;
    No: number;
    Total: number;
}
import { EventAttendee } from "./EventAttendee";

    export interface EventAttendeeQueryResult { 
        Total: number;
        Attendees: EventAttendee[];
        Hotel: number;
        RSVPD: number;
        Completed: number;
        Segments: { [key: string]: number; };
    }
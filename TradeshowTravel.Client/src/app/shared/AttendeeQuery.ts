import { UserProfile } from "./UserProfile";
 
export interface AttendeeQueryResult { 
    Total: number;
    Attendees: UserProfile[];
}
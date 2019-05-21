import { UserProfile } from './UserProfile'
import { AttendeeStatus } from './Enums';
import { EventInfo } from './EventInfo';

export interface EventAttendee { 
    ID: number;
    EventID: number;
    Username: string;
    Status: AttendeeStatus;
    SendRSVP: boolean;
    DateCreated: Date;
    DateRSVP: Date;
    DateCompleted: Date;
    Arrival: Date;
    Departure: Date;
    TravelMethod: string;
    CCNumber: string;
    CCExpiration: string;
    CVVNumber: string;
    IsHotelNeeded: string;
    IsAttending: string;
    Profile: UserProfile;
    Properties: { [key: number]: string; };
    Event: EventInfo;
}
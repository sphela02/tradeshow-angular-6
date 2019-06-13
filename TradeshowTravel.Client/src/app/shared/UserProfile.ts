import { Permissions, Role } from './shared.module';
import { UserInfo } from './UserInfo';

export interface UserProfile { 
    Username: string;
    EmplID: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Segment: string;
    Title: string;
    Mobile: string;
    Telephone: string;
    BadgeName: string;
    PassportNumber: string;
    PassportName: string;
    PassportExpirationDate: Date;
    DOB: Date;
    Nationality: string;
    COB: string;
    COR: string;
    COI: string;
    Privileges: Permissions;
    Role: Role;
    ShowPicture: boolean;
    EventsAttended: number;
    DelegateUsername: string;
    Delegate: UserInfo;
    Visa: string;
}

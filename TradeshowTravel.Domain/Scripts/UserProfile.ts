import { UserInfo } from "./UserInfo";
import { UserProfile } from "./UserProfile";
import { Permissions } from "./Enums";
import { Role } from "./Enums";

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
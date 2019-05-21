import { Role, ShowType, InputType } from './Enums';
import { UserInfo } from './UserInfo';

export interface EventInfo { 
    ID: number;
    Name: string;
    Description: string;
    Venue: string;
    Location: string;
    StartDate: Date;
    EndDate: Date;
    Segments: string;
    ShowType: ShowType;
    Tier: string;
    RosterDueDate: Date;
    RsvpDueDate: Date;
    BureauLink: string;
    Hotels: string;
    EstAttendCount: number;
    OwnerUsername: string;
    Owner: UserInfo;
    CreatedDate: Date;
    SendReminders: boolean;
    Archived: boolean;
    Users: EventUser[];
    Fields: EventField[];
    RoomBlocks: EventRoomBlock[];
}

export interface EventUser { 
    User: UserInfo;
    Role: Role;
}

export interface EventField { 
    ID: number;
    Label: string;
    Input: InputType;
    Source: string;
    Tooltip: string;
    Options: string;
    Order: number;
    Required: boolean;
    Included: boolean;
    Access: Role;
}

export interface EventRoomBlock { 
    Date: Date;
    EstRoomCount: number;
}
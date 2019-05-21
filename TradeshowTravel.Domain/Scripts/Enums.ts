    
    export enum Role {
        None = 0,
        Attendee = 1,
        Travel = 2,
        Support = 4,
        Business = 8,
        Lead = 16,
        BackOffice = 30,
        All = 31,
        Admin = 31,
    }
    
    export enum Permissions {
        None = 0,
        CreateShows = 1,
        Admin = 2147483647,
    }
    
    export enum ShowType {
        Unknown = 0,
        Domestic = 1,
        International = 2,
    }
    
    export enum InputType {
        Unknown = 0,
        ShortText = 1,
        LongText = 2,
        Date = 3,
        YesOrNo = 4,
        Select = 5,
        MultiSelect = 6,
    }
    
    export enum AttendeeStatus {
        Unknown = 0,
        Accepted = 1,
        Declined = 2,
        Invited = 3,
        Pending = 4,
    }
    
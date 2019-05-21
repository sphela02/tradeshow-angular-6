
export enum SideMenuMode {
    Attendees = 0,
    Events = 1,
    Settings = 2,
    Profile = 3
}

export interface SideMenuSelection {
    mainMenu: SideMenuMode;
    childMenu: string;
}

export enum EventViewMode {
    None = 0,
    List = 1,
    Display = 2
}

export enum EventDisplayTab {
    Details = 0,
    Fields = 1,
    Settings = 2,
    Attendee = 3
}

export enum AttendeeViewMode {
    None = 0,
    List = 1,
    Display = 2,
    MyProfile = 3
}

export enum AttendeeDisplayTab {
    Profile = 0,
    Attendee = 1
}

export enum EventStatusFilter {
    Upcoming = 0,
    Past = 1
}
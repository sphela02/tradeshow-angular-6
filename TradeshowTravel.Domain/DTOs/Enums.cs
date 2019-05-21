using System;

namespace TradeshowTravel.Domain.DTOs
{
    [Flags]
    public enum Role : int
    {
        None = 0,
        Attendee = 1,
        Travel = 2,
        Support = 4,
        Business = 8,
        Lead = 16,
        BackOffice = Lead | Support | Travel | Business,
        All = BackOffice | Attendee,
        Admin = BackOffice | Attendee
    }

    [Flags]
    public enum Permissions : int
    {
        None = 0,
        CreateShows = 1,
        Admin = int.MaxValue
    }

    public enum ShowType
    {
        Unknown,
        Domestic,
        International
    }

    public enum InputType
    {
        Unknown,
        ShortText,
        LongText,
        Date,
        YesOrNo,
        Select,
        MultiSelect
    }

    public enum AttendeeStatus
    {
        Unknown,
        Accepted,
        Declined,
        Invited,
        Pending
    }

}

using System;

namespace TradeshowTravel.Domain.DTOs
{
    public class UserProfile
    {
        public static readonly string[] PROFILE_REQ_FIELDS = new string[]
        {
            "FirstName",
            "LastName",
            "Email"
        };

        public static readonly string[] EVENT_PROFILE_REQ_FIELDS = new string[]
        {
            "FirstName",
            "LastName",
            "Segment",
            "Email",
            "Telephone",
            "Mobile",
            "BadgeName"
        };

        public static readonly string[] PASSPORT_REQ_FIELDS = new string[]
        {
            "PassportName",
            "PassportNumber",
            "PassportExpirationDate",
            "DOB",
            "Nationality",
            "COB",
            "COR",
            "COI"
        };

        public string Username { get; set; }
        public string EmplID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Segment { get; set; }
        public string Title { get; set; }
        public string Mobile { get; set; }
        public string Telephone { get; set; }
        public string BadgeName { get; set; }
        public string PassportNumber { get; set; }
        public string PassportName { get; set; }
        public DateTime? PassportExpirationDate { get;set; }
        public DateTime? DOB { get; set; }
        public string Nationality { get; set; }
        public string COB { get; set; }
        public string COR { get; set; }
        public string COI { get; set; }
        public Permissions Privileges { get; set; }
        public Role Role { get; set; }
        public bool ShowPicture { get; set; }
        public int EventsAttended { get; set; }
        public string DelegateUsername { get; set; }
        public UserInfo Delegate { get; set; }
        
        public UserProfile()
        {
            Privileges = Permissions.None;
            Role = Role.None;
            ShowPicture = true;
        }
    }
}

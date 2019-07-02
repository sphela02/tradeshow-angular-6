using System;
using System.Collections.Generic;

namespace TradeshowTravel.Data.Models
{
    using Domain;
    using Domain.DTOs;

    public class User
    {
        public User()
        {
            Constituents = new HashSet<User>();
            Attendees = new HashSet<Attendee>();
            ShowTeams = new HashSet<TradeshowUser>();
            Tradeshows = new HashSet<Tradeshow>();
            TradeshowsUpdated = new HashSet<Tradeshow>();
        }
        
        public User(UserInfo user) : this()
        {
            Username = user.Username;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Email = user.Email;
            Segment = user.Segment;
        }

        public User(UserProfile profile) : this()
        {
            Username = profile.Username;
            FirstName = profile.FirstName;
            LastName = profile.LastName;
            Segment = profile.Segment;
            Email = profile.Email;
            DelegateUsername = profile.DelegateUsername;
            EmplID = profile.EmplID;
            Title = profile.Title;
            Mobile = profile.Mobile;
            Telephone = profile.Telephone;
            BadgeName = profile.BadgeName;
            Privileges = profile.Privileges;

            Visa = profile.Visa.ToBool();
            PassportName = profile.PassportName;
            PassportNumber = profile.PassportNumber;
            PassportExpirationDate = profile.PassportExpirationDate.ToDTOFormat();
            DOB = profile.DOB.ToDTOFormat();
            Nationality = profile.Nationality;
            COB = profile.COB;
            COR = profile.COR;
            COI = profile.COI;
        }
        
        public string Username { get; set; }
        public string DelegateUsername { get; set; }
        public string EmplID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Segment { get; set; }
        public string Title { get; set; }
        public string Mobile { get; set; }
        public string Telephone { get; set; }
        public string BadgeName { get; set; }
        public bool Visa { get; set; }

        [Encrypted]
        public string PassportNumber { get; set; }
        [Encrypted]
        public string PassportName { get; set; }
        [Encrypted]
        public string PassportExpirationDate { get;set; }
        [Encrypted]
        public string DOB { get; set; }
        [Encrypted]
        public string Nationality { get; set; }
        [Encrypted]
        public string COB { get; set; }
        [Encrypted]
        public string COR { get; set; }
        [Encrypted]
        public string COI { get; set; }

        public Permissions Privileges { get; set; }
        public User Delegate { get; set; }
        
        public virtual ICollection<User> Constituents { get; set; }
        public virtual ICollection<Attendee> Attendees { get; set; }
        public virtual ICollection<TradeshowUser> ShowTeams { get; set; }
        public virtual ICollection<Tradeshow> Tradeshows { get; set; }

        public virtual ICollection<Tradeshow> TradeshowsUpdated { get; set; }
    }
}

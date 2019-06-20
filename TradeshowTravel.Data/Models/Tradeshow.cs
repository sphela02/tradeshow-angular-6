using System;
using System.Collections.Generic;

namespace TradeshowTravel.Data.Models
{
    public class Tradeshow
    {
        public Tradeshow()
        {
            Attendees = new HashSet<Attendee>();
            Fields = new HashSet<TradeshowField>();
            Users = new HashSet<TradeshowUser>();
            RoomBlocks = new HashSet<TradeshowRoomBlock>();
            SendReminders = true;
        }

        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Venue { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Segments { get; set; }
        public string ShowType { get; set; }
        public string Tier { get; set; }
        public DateTime? RosterDueDate { get; set; }
        public DateTime? RsvpDueDate { get; set; }
        public string BureauLink { get; set; }
        public string Hotels { get; set; }
        public int EstAttendeeCount { get; set; }
        public string OwnerUsername { get; set; }
        public string LastBcdUpdateUsername { get; set; }
        public DateTime? LastBcdUpdatedDateTime { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool SendReminders { get; set; }
        public bool Archived { get; set; }

        public virtual User Owner { get; set; }
        public virtual User LastBcdUpdated { get; set; }
        public virtual ICollection<Attendee> Attendees { get; set; }
        public virtual ICollection<TradeshowField> Fields { get; set; }
        public virtual ICollection<TradeshowUser> Users { get; set; }
        public virtual ICollection<TradeshowRoomBlock> RoomBlocks { get; set; }
    }
}

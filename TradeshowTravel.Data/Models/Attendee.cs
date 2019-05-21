using System;
using System.Collections.Generic;

namespace TradeshowTravel.Data.Models
{
    using Domain;

    public class Attendee
    {
        public Attendee()
        {
            FieldValues = new HashSet<AttendeeValue>();
        }

        public int ID { get; set; }
        public int TradeshowID { get; set; }
        public string Username { get; set; }
        public string Status { get; set; }
        public DateTime? Arrival { get; set; }
        public DateTime? Departure { get; set; }
        public string TravelMethod { get; set; }

        [Encrypted]
        public string CCNumber { get; set; }
        [Encrypted]
        public string CCExpiration { get; set; }
        [Encrypted]
        public string CVVNumber { get; set; }

        public bool? IsHotelNeeded { get; set; }
        public bool SendRSVP { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime? DateRSVP { get; set; }
        public DateTime? DateAccepted { get; set; }
        public DateTime? DateCancelled { get; set; }
        public DateTime? DateCompleted { get; set; }
        
        public virtual Tradeshow Tradeshow { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<AttendeeValue> FieldValues { get; set; }
    }
}

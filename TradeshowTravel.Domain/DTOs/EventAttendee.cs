using System;
using System.Collections.Generic;

namespace TradeshowTravel.Domain.DTOs
{
    public class EventAttendee
    {
        public int ID { get; set; }
        public int EventID { get; set; }
        public string Username { get; set; }
        public AttendeeStatus Status { get; set; }
        public bool SendRSVP { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateRSVP { get; set; }
        public DateTime? DateCompleted { get; set; }

        public DateTime? Arrival { get; set; }
        public DateTime? Departure { get; set; }
        public string TravelMethod { get; set; }
        public string CCNumber { get; set; }
        public string CCExpiration { get; set; }
        public string CVVNumber { get; set; }
        public string IsHotelNeeded { get; set; }
        public string IsAttending { get; set; }

        public UserProfile Profile { get; set; }
        public Dictionary<int, string> Properties { get; set; }

        public EventInfo Event { get; set; }
    }
}

using System.Collections.Generic;

namespace TradeshowTravel.Domain.DTOs
{
    public class AttendeeQueryResult
    {
        public AttendeeQueryResult()
        {
            Attendees = new List<UserProfile>();
        }

        public int Total { get; set; }
        public virtual List<UserProfile> Attendees { get; set; }
    }
}

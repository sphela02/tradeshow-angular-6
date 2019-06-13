using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeshowTravel.Domain.DTOs
{
    public class EventAttendeeQueryResult
    {
        public EventAttendeeQueryResult()
        {
            Segments = new Dictionary<string, int>();
        }

        public int Total { get; set; }
        public List<EventAttendee> Attendees { get; set; }
        
        public int Hotel { get; set; }
        public int RSVPD { get; set; }
        public int Completed { get; set; }
        public virtual Dictionary<string, int> Segments { get; set; }
    }
}

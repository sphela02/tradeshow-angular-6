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
            RSVPD = new EventAttendeeRSVPD();
            Segments = new Dictionary<string, int>();
        }

        public int Total { get; set; }
        public List<EventAttendee> Attendees { get; set; }
        
        public int Hotel { get; set; }
        public EventAttendeeRSVPD RSVPD { get; set; }
        public int Completed { get; set; }
        public bool IsAttending { get; set; }
        public virtual Dictionary<string, int> Segments { get; set; }
    }

    public class EventAttendeeRSVPD
    {
        public int Yes { get; set; }
        public int No { get; set; }
        public int Total
        {
            get { return Yes + No; }
        }
    }
}

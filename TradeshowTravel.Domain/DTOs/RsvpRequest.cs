using System;
using System.Web;

namespace TradeshowTravel.Domain.DTOs
{
    public class RsvpRequest
    {
        public int[] AttendeeIDs { get; set; }
        public DateTime DueDate { get; set; }
        public HttpFileCollection Attachments { get; set; }
    }
}

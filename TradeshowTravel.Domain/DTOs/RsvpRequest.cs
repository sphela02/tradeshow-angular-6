using System;
using System.Web;

namespace TradeshowTravel.Domain.DTOs
{
    public class RsvpRequest
    {
        public int[] AttendeeIDs { get; set; }
        public DateTime DueDate { get; set; }
        public string[] Attachments { get; set; }
        public string EmailText { get; set; }
    }
}

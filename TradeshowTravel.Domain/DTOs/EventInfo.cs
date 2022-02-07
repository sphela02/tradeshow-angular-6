using System;
using System.Collections.Generic;

namespace TradeshowTravel.Domain.DTOs
{
    public class EventInfo
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Venue { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Segments { get; set; }
        public ShowType ShowType { get; set; }
        public string Tier { get; set; }
        public DateTime? RosterDueDate { get; set; }
        public DateTime? RsvpDueDate { get; set; }
        public string BureauLink { get; set; }
        public string Hotels { get; set; }
        public int EstAttendCount { get; set; }
        public string OwnerUsername { get; set; }
        public string LastBcdUpdatedUsername { get; set; }
        public UserInfo Owner { get; set; }
        public UserInfo LastBcdUpdated { get; set; }
        public DateTime? LastBcdUpdatedDateTime { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool SendReminders { get; set; }
        public bool Archived { get; set; }
        public List<EventUser> Users { get; set; }
        public List<EventField> Fields { get; set; }
        public List<EventRoomBlock> RoomBlocks { get; set; }
    }

    public class EventUser
    {
        public UserInfo User { get; set; }
        public Role Role { get; set; }
    }

    public class EventField
    {
        public int ID { get; set; }
        public string Label { get; set; }
        public InputType Input { get; set; }
        public string Source { get; set; }
        public string Tooltip { get; set; }
        public string Options { get; set; }
        public string Format { get; set; }
        public int Order { get; set; }
        public bool Required { get; set; }
        public bool Included { get; set; }
        public Role Access { get; set; }
    }

    public class EventRoomBlock
    {
        public DateTime Date { get; set; }
        public int EstRoomCount { get; set; }
    }
}

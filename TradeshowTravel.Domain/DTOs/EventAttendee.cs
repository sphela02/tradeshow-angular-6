using System;
using System.Collections.Generic;
using System.Linq;

namespace TradeshowTravel.Domain.DTOs
{
    public class EventAttendee
    {
        public FieldComparisonResponse Compare(EventAttendee originalEventAttendee)
        {
            FieldComparisonResponse response = new FieldComparisonResponse();

            if (!DateRSVP.DatePartEquals(originalEventAttendee.DateRSVP))
            {
                response.Values.Add(new FieldComparisionInfo(nameof(DateRSVP), originalEventAttendee.DateRSVP.ToShortDateFormat(), DateRSVP.ToShortDateFormat()));
            }

            if (!Arrival.DatePartEquals(originalEventAttendee.Arrival))
            {
                response.Values.Add(new FieldComparisionInfo(nameof(Arrival), originalEventAttendee.Arrival.ToShortDateFormat(), Arrival.ToShortDateFormat()));
            }

            if (!Departure.DatePartEquals(originalEventAttendee.Departure))
            {
                response.Values.Add(new FieldComparisionInfo(nameof(Departure), originalEventAttendee.Departure.ToShortDateFormat(), Departure.ToShortDateFormat()));
            }

            if (TravelMethod != originalEventAttendee.TravelMethod)
            {
                response.Values.Add(new FieldComparisionInfo(nameof(TravelMethod), originalEventAttendee.TravelMethod, TravelMethod));
            }

            if (CCNumber != originalEventAttendee.CCNumber)
            {
                response.Values.Add(new FieldComparisionInfo(nameof(CCNumber), originalEventAttendee.CCNumber, CCNumber));
            }

            if (CCExpiration != originalEventAttendee.CCExpiration)
            {
                response.Values.Add(new FieldComparisionInfo(nameof(CCExpiration), originalEventAttendee.CCExpiration, CCExpiration));
            }

            if (CVVNumber != originalEventAttendee.CVVNumber)
            {
                response.Values.Add(new FieldComparisionInfo(nameof(CVVNumber), originalEventAttendee.CVVNumber, CVVNumber));
            }

            if (IsHotelNeeded != originalEventAttendee.IsHotelNeeded)
            {
                response.Values.Add(new FieldComparisionInfo(nameof(IsHotelNeeded), originalEventAttendee.IsHotelNeeded, IsHotelNeeded));
            }

            if (IsAttending != originalEventAttendee.IsAttending)
            {
                response.Values.Add(new FieldComparisionInfo(nameof(IsAttending), originalEventAttendee.IsAttending, IsAttending));
            }

            //User defined properties below
            foreach (var property in Properties)
            {
                var originalPropertyValues = originalEventAttendee.Properties.ContainsKey(property.Key) ? originalEventAttendee.Properties[property.Key] : null;

                if (!string.Equals(originalPropertyValues, property.Value))
                {
                    var eventField = Event.Fields.FirstOrDefault(f => f.ID == property.Key);
                    if (eventField != null) //It should never be null but just in case.
                    {
                        response.Values.Add(new FieldComparisionInfo(eventField.Label, originalPropertyValues, property.Value));
                    }
                }
            }

            return response;
        }

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

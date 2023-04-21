using System.Collections.Generic;

namespace TradeshowTravel.ECA.Models
{
    public class Associate
    {
        public string EcaId { get; set; }
        public string EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Title { get; set; }
        public string ClassCode { get; set; }
        public string Status { get; set; }
        public string ManagerEcaId { get; set; }
        public string SegmentCode { get; set; }
        public string Company { get; set; }
        
        public ICollection<PhoneNumber> PhoneNumbers { get; set; }

        public bool ShowPicture
        {
            get { return !string.IsNullOrWhiteSpace(EmployeeId); }
        }
    }

    public class PhoneNumber
    {
        public string Number { get; set; }
        public string PhoneTypeText { get; set; }
    }
}

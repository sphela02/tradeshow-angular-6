namespace TradeshowTravel.ECA.Models
{
    public class GetAssociateByEcaIdParams
    {
        public const string METHOD_NAME = "/V1/GetAssociateByEcaId";

        public string ecaId { get; set; }
        
        public string[] fields { get; set; } = new string[]
        {
            "EcaId",
            "EmployeeId",
            "FirstName",
            "LastName",
            "Email",
            "Title",
            "PhoneNumbers",
            "ClassCode",
            "Status",
            "ManagerEcaId",
            "SegmentCode"
        };

        public bool includeActive { get; set; } = true;

        public bool includeInactive { get; set; } = true;
    }
}

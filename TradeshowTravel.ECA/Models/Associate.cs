
using System.Configuration;
using TradeshowTravel.Domain;

namespace TradeshowTravel.ECA.Models
{
    public class Associate
    {
        public static readonly string[] ACTIVE_STATUSES = ConfigurationManager.AppSettings["ECA_ActiveStatuses"].Split(',');

        public string ID { get; set; }
        public string Username { get; set; }
        public string EmplID { get; set; }
        public string First { get; set; }
        public string Last { get; set; }
        public string PreferredFirst { get; set; }
        public string PreferredLast { get; set; }
        public string PreferredEmail { get; set; }
        public string StandardEmail { get; set; }
        public string Title { get; set; }
        public string Telephone { get; set; }
        public string Mobile { get; set; }
        public string Class { get; set; }
        public string Status { get; set; }
        public string SupervisorID { get; set; }
        public string Segment { get; set; }
        public string Company { get; set; }
        public string ShowPictureFlag { get; set; }
        
        public string FirstName
        {
            get { return string.IsNullOrWhiteSpace(PreferredFirst) ? First : PreferredFirst; }
        }
        public string LastName
        {
            get { return string.IsNullOrWhiteSpace(PreferredLast) ? Last : PreferredLast; }
        }
        public string Email
        {
            get
            {
                return IsContractor && !string.IsNullOrWhiteSpace(PreferredEmail) ? PreferredEmail.NormalizeEmail() : StandardEmail.NormalizeEmail();
            }
        }

        public bool IsContractor { get { return Class == ConfigurationManager.AppSettings["ECA_ContractorFlag"]; } }

        public bool ShowPicture
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(ShowPictureFlag))
                {
                    return ShowPictureFlag == ConfigurationManager.AppSettings["ECA_ShowPictureFlag"];
                }

                return true;
            }
        }
    }
}

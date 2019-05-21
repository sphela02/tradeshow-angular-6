
namespace TradeshowTravel.ECA.Models
{
    public class Associate
    {
        public static readonly string[] ACTIVE_STATUSES = new string[]
        {
            "A", "L", "P"
        };

        public string ID { get; set; }
        public string Username { get; set; }
        public string EmplID { get; set; }
        public string First { get; set; }
        public string Last { get; set; }
        public string PreferredFirst { get; set; }
        public string PreferredLast { get; set; }
        public string PreferredEmail { get; set; }
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
                string email = string.IsNullOrWhiteSpace(PreferredEmail) ? Username : PreferredEmail;

                if (!email.Contains("@"))
                {
                    email += "@" + Extensions.EmailDomain;
                }

                return email.ToLower();
            }
        }

        public bool ShowPicture
        {
            get
            {
                if (!string.IsNullOrWhiteSpace(ShowPictureFlag))
                {
                    return ShowPictureFlag == "Y";
                }

                return true;
            }
        }
    }
}

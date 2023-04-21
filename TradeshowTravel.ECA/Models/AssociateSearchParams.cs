using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeshowTravel.ECA.Models
{
    public class AssociateSearchParams
    {
        public const string METHOD_NAME = "/V1/AssociateSearch";

        public string searchTerm { get; set; }

        public string[] fields { get; set; } = new string[]
        {
            "EcaId",
            "FirstName",
            "LastName",
            "Email",
            "SegmentCode"
        };

        public bool includeActive { get; set; } = true;

        public bool includeInactive { get; set; } = false;

        public int? numResults { get; set; }
    }
}

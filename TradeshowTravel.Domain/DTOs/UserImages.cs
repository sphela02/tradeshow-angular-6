using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeshowTravel.Domain.DTOs
{
    using Domain;

    public class UserImages
    {
        public string Username { get; set; }

        [Encrypted]
        public byte[] Image { get; set; }

        public string ImageType { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
    }
}

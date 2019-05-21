using System.Collections.Generic;

namespace TradeshowTravel.Data.Models
{
    using Domain.DTOs;

    public class DefaultField
    {
        public int ID { get; set; }
        public string Label { get; set; }
        public string Input { get; set; }
        public string Source { get; set; }
        public string Tooltip { get; set; }
        public string Options { get; set; }
        public int Order { get; set; }
        public bool Required { get; set; }
        public bool Included { get; set; }
        public Role Access { get; set; }
    }
}

using System.Collections.Generic;

namespace TradeshowTravel.Domain.DTOs
{
    public class QueryParams
    {
        public int Skip { get; set; }
        public int Size { get; set; }
        public List<FilterParams> Filters { get; set; }
        public List<SortParams> Sort { get; set; }
    }

    public class FilterParams
    {
        public string Field { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }
    }

    public class SortParams
    {
        public bool Desc { get; set; }
        public string Field { get; set; }
    }
}

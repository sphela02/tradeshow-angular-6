using System.Collections.Generic;
using System.Linq;

namespace TradeshowTravel.Domain.DTOs
{
    public class FieldComparisonResponse
    {
        public FieldComparisonResponse()
        {
            Values = new List<FieldComparisionInfo>();
        }

        public void Add(string fieldName, string originalValue, string newValue)
        {
            Values.Add(new FieldComparisionInfo(fieldName, originalValue, newValue));
        }

        public IList<FieldComparisionInfo> Values { get; private set; }

        public bool IsChanged => Values?.Any() ?? false;
    }

    public class FieldComparisionInfo
    {
        public FieldComparisionInfo(string fieldName, string originalValue, string newValue)
        {
            FieldName = fieldName;
            OriginalValue = originalValue;
            NewValue = newValue;
        }
        public string OriginalValue { get; private set; }
        public string NewValue { get; private set; }
        public string FieldName { get; private set; }
    }
}


using TRAISI.SDK.Enums;

namespace TRAISI.SDK
{
    public class QuestionOptionDefinition
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public QuestionOptionValueType ValueType { get; set; }

        public object TypeId { get; set; }

        public string DefaultValue { get; set; }


    }
}

using TRAISI.SDK.Enums;

namespace TRAISI.SDK
{
    public class QuestionConfigurationDefinition
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public QuestionConfigurationValueType ValueType { get; set; }

        public QuestionBuilderType BuilderType { get; set; }

        public object TypeId { get; set; }

        public string DefaultValue {get;set;}
    }
}
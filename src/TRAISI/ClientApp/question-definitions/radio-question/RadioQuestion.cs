
using System.Collections;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{
    [SurveyQuestion]
    public class RadioQuestion : ISurveyQuestion
    {
        public string TypeName =>  "Radio Select";

        public string Icon { get => "radio"; set {} }

        [QuestionParameter(QuestionParameterType.OptionList,
        ParameterName="Response Options",
        ParameterDescription="The list of available radio responses presented to the user.")]
        public ICollection ResponseOptions;
    }

}

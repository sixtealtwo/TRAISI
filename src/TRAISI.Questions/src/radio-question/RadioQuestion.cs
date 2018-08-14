using System.Collections;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{
    [SurveyQuestion(QuestionResponseType.Integer)]
    public class RadioQuestion : ISurveyQuestion
    {
        public string TypeName => "Radio Select";

        public string Icon
        {
            get => "fa-dot-circle-o";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }

        [QuestionOption(QuestionOptionValueType.KeyValuePair,
        IsMultipleAllowed = true,
            Name = "Response Options",
            Description = "The list of available radio responses presented to the user.")]
        public ICollection ResponseOptions;


        [QuestionConfiguration(QuestionConfigurationValueType.Boolean,
        Name="Allow Multiple Selections")]
        public bool AllowMultipleSelections;
    }

}

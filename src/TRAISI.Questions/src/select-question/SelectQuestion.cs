using System.Collections;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;


namespace TRAISI.SDK.Questions
{
    [SurveyQuestion(QuestionResponseType.OptionSelect)]
    public class SelectQuestion : ISurveyQuestion
    {
        public string TypeName => "Select";

        public string Icon
        {
            get => "fas fa-angle-down";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }

        [QuestionOption(QuestionOptionValueType.KeyValuePair,
        IsMultipleAllowed = true,
            Name = "Response Options",
            Description = "The list of available responses presented to the user.",
            SurveyBuilderValueType = QuestionOptionValueType.KeyValuePair)]
        public ICollection ResponseOptions;
    }

}

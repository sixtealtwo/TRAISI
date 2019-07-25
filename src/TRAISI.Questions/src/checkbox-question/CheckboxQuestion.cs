using System.Collections;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;


namespace TRAISI.SDK.Questions
{
    [SurveyQuestion(QuestionResponseType.OptionSelect, CodeBundleName = "traisi-questions-general.module.js")]
    public class CheckboxQuestion : ISurveyQuestion
    {
        public string TypeName => "checkbox";

        public string Icon
        {
            get => "far fa-check-square";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }

        [QuestionOption(QuestionOptionValueType.KeyValuePair,
            IsMultipleAllowed = true,
            Name = "Response Options",
            Description = "The list of available checkbox responses presented to the user.",
            SurveyBuilderValueType = QuestionOptionValueType.KeyValuePair)]
        public ICollection ResponseOptions;
    }

}

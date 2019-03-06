using System.Collections;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Library.ResponseTypes;

namespace TRAISI.SDK.Questions
{

    [SurveyQuestion(QuestionResponseType.OptionSelect,
    CodeBundleName = "traisi-questions-sp.module.js",
    CustomBuilderView = "stated_preference_custom_builder",
     ResponseValidator = typeof(TextQuestionValidator)),
   ]
    public class StatedPreferenceQuestion : ISurveyQuestion
    {
        [QuestionOption(QuestionOptionValueType.KeyValuePair,
        IsMultipleAllowed = true,
            Name = "Response Options",
            Description = "Responce choices for the SP selections.",
            SurveyBuilderValueType = QuestionOptionValueType.KeyValuePair)]
        public ICollection ResponseOptions;

        [QuestionOption(QuestionOptionValueType.String,
        IsMultipleAllowed = true,
            Name = "Row Headers",
            Description = "Row header information",
            SurveyBuilderValueType = QuestionOptionValueType.KeyValuePair)]
        public ICollection<string> RowHeaders;

        public string TypeName
        {
            get => "stated_preference";
        }
        public string Icon
        {
            get => "fas fa-table";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }



    }

}

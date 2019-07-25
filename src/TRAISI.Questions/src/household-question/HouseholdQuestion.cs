using System.Collections;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;


namespace TRAISI.SDK.Questions
{
    [SurveyQuestion(QuestionResponseType.None, CodeBundleName = "traisi-questions-general.module.js")]
    public class HouseholdQuestion : ISurveyQuestion
    {
        public string TypeName => "household";

        public string Icon => "fas fa-home";

        public QuestionIconType IconType => QuestionIconType.FONT;
    }
}
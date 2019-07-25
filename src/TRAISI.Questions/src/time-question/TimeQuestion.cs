using System.Collections;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;


namespace TRAISI.SDK.Questions
{
	[SurveyQuestion(QuestionResponseType.DateTime, CodeBundleName = "traisi-questions-general.module.js",
	ResponseValidator = typeof(DateQuestionValidator))]
    public class TimeQuestion : ISurveyQuestion
    {
        public string TypeName => "Time";

        public string Icon
        {
            get => "far fa-clock";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }
    }

}

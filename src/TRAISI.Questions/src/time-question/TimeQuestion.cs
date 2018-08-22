using System.Collections;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;


namespace TRAISI.SDK.Questions
{
    [SurveyQuestion(QuestionResponseType.String)]
    public class TimeQuestion : ISurveyQuestion
    {
        public string TypeName => "Time Select";

        public string Icon
        {
            get => "fa-clock-o";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }
    }

}

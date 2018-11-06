using System.Collections;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using System;

namespace TRAISI.SDK.Questions
{
    [SurveyQuestion(QuestionResponseType.DateTime, CodeBundleName = "traisi-questions-general.module.js")]
    public class DateQuestion : ISurveyQuestion
    {
        public string TypeName => "Date";

        public string Icon
        {
            get => "far fa-calendar-alt";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }

        [QuestionConfiguration(QuestionConfigurationValueType.Date,
        Name = "Min Date",
        Description = "Minimum Date.",
        SurveyBuilderValueType = QuestionBuilderType.Date,
        DefaultValue = "1/1/2018")]
        public DateTime MinDate;

        [QuestionConfiguration(QuestionConfigurationValueType.Date,
        Name = "Max Date",
        Description = "Maximum Date.",
        SurveyBuilderValueType = QuestionBuilderType.Date,
        DefaultValue = "1/1/2018")]
        public DateTime MaxDate;
    }

}

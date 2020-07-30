using System.Collections;
using System.Collections.Generic;
using Traisi.Sdk.Attributes;
using Traisi.Sdk.Enums;
using Traisi.Sdk.Interfaces;
using Traisi.Sdk.Library.ResponseTypes;

namespace Traisi.Sdk.Questions
{

    [SurveyQuestion(QuestionResponseType.None, CodeBundleName = "traisi-questions-travel.module.js")]
    public class TravelDiaryQuestion : ISurveyQuestion
    {

        public string TypeName
        {
            get => "travel-diary";
        }
        public string Icon
        {
            get => "fas fa-table";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }

         /// <summary>
        /// The minimum or earliest allowed date
        /// </summary>
        [QuestionConfiguration(ConfigurationValueType.Date,
        DisplayName = "Min Date",
        Description = "Minimum Date.",
        SurveyBuilderValueType = QuestionBuilderType.Date,
        DefaultValue = "1/1/2018")]
        public DateTime MinDate;

    }

}

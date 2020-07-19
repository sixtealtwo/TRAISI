using System.Collections;
using System.Collections.Generic;
using Traisi.Sdk.Attributes;
using Traisi.Sdk.Enums;
using Traisi.Sdk.Interfaces;
using Traisi.Sdk.Library.ResponseTypes;

namespace Traisi.Sdk.Questions
{

    [SurveyQuestion(QuestionResponseType.None, CodeBundleName = "traisi-questions-travel.module.js")]
    public class TravelModeQuestion : ISurveyQuestion
    {

        public string TypeName
        {
            get => "travel-mode";
        }
        public string Icon
        {
            get => "fas fa-table";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }

    }

}

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Traisi.Sdk.Attributes;
using Traisi.Sdk.Enums;
using Traisi.Sdk.Interfaces;
using Traisi.Sdk.Library.ResponseTypes;

namespace Traisi.Sdk.Questions
{
    [SurveyQuestion(QuestionResponseType.String, CodeBundleName = "traisi-questions-kmlfile.module.js")]
    public class KMLFileQuestion : ISurveyQuestion
    {
        public string TypeName
        {
            get => "kml-file";
        }

        public virtual string Icon
        {
            get => "fas fa-upload";
        }

        public QuestionIconType IconType
        {
            get => QuestionIconType.FONT;
        }

        [QuestionConfiguration (ConfigurationValueType.Integer,
			DisplayName = "Date",
			Description = "Accepted date of the KML file.",
			SurveyBuilderValueType = QuestionBuilderType.NumericText,
			DefaultValue = 1)]
		public int KMLDate = 1;
    }
}
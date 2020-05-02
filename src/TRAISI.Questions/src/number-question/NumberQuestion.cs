using System.Collections;
using System.Collections.Generic;
using Traisi.Sdk.Attributes;
using Traisi.Sdk.Enums;
using Traisi.Sdk.Interfaces;
using Traisi.Sdk.Library.ResponseTypes;

namespace Traisi.Sdk.Questions {
	[SurveyQuestion (QuestionResponseType.Integer, CodeBundleName = "traisi-questions-general.module.js",
		ResponseValidator = typeof (NumberQuestionValidator))]
	public class NumberQuestion : ISurveyQuestion {
		public string TypeName => "number";

		public string Icon {
			get => "fas fa-sort-numeric-up";
		}
		public QuestionIconType IconType { get => QuestionIconType.FONT; }

		[QuestionConfiguration (ConfigurationValueType.String,
			Name = "Number Format",
			Description = "Format of the number.",
			SurveyBuilderValueType = QuestionBuilderType.SingleSelect,
			DefaultValue = "Integer",
			Resource = "numberquestion-format")]
		public string Format = "Integer";

		[QuestionConfiguration (ConfigurationValueType.Integer,
			Name = NumberQuestionConfiguration.MIN_VALUE,
			Description = "Minimum Number.",
			SurveyBuilderValueType = QuestionBuilderType.NumericText,
			DefaultValue = 0)]
		public int Min = 0;

		[QuestionConfiguration (ConfigurationValueType.Integer,
			Name = NumberQuestionConfiguration.MAX_VALUE,
			Description = "Maximum Number.",
			SurveyBuilderValueType = QuestionBuilderType.NumericText,
			DefaultValue = 100)]
		public int Max = 100;
	}

}
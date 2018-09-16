using System;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.ClientApp.question_definitions.map_question {
	[SurveyQuestion(QuestionResponseType.Location, CodeBundleName = "traisi-questions-map.module.js")]
	public class MapQuestion : ISurveyQuestion {
		public string TypeName {
			get => "location";
		}

		public virtual string Icon {
			get => "fas fa-map-marker-alt";
		}

		public QuestionIconType IconType {
			get => QuestionIconType.FONT;
		}


		[QuestionConfiguration(QuestionConfigurationValueType.String,
			Name = "Mapbox Style",
			Description = "Style string to use for map.",
			SurveyBuilderValueType = QuestionBuilderType.Text,
			DefaultValue = "mapbox://styles/mapbox/streets-v9?optimize=true")]
		public string Style = "mapbox://styles/mapbox/streets-v9?optimize=true";

		[QuestionConfiguration(QuestionConfigurationValueType.String,
			Name = "Mapbox Access Token",
			Description = "API Access token for the Mapbox service.",
			SurveyBuilderValueType = QuestionBuilderType.Text,
			DefaultValue = "")]
		public string AccessToken = "";

		[QuestionConfiguration(QuestionConfigurationValueType.Integer,
			Name = "Mapbox Default Zoom",
			Description = "Initial zoom level.",
			SurveyBuilderValueType = QuestionBuilderType.NumericText,
			DefaultValue = "8")]
		public int Zoom = 8;

		[QuestionConfiguration(QuestionConfigurationValueType.Tuple,
			Name = "Mapbox Default Centre",
			Description = "Initial centre location.",
			SurveyBuilderValueType = QuestionBuilderType.Location,
			DefaultValue = "-79.40|43.67")]
		public Tuple<double, double> Centre = new Tuple<double, double>(-79.40, 43.67);

		[QuestionConfiguration(QuestionConfigurationValueType.String,
			Name = "Purpose",
			Description = "Purpose of being at location.",
			SurveyBuilderValueType = QuestionBuilderType.SingleSelect,
			DefaultValue = "home",
			Resource = "mapquestion-purpose")]
		public string Purpose = "home";
	}
}
using System;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
namespace TRAISI.ClientApp.question_definitions.map_question
{

	[SurveyQuestion(QuestionResponseType.Location)]
	public class MapQuestion : ISurveyQuestion
	{
		public string TypeName
		{
			get => "Location";
		}

		public virtual string Icon
		{
			get => "fa-map-marker";
		}
		public QuestionIconType IconType { get => QuestionIconType.FONT; }


		[QuestionConfiguration(QuestionConfigurationValueType.String,
		Name = "Mapbox Style",
		Description = "Style string to use for map.",
        SurveyBuilderValueType = QuestionBuilderType.Text)]
		public string Style = "mapbox://styles/mapbox/streets-v9?optimize=true";

		[QuestionConfiguration(QuestionConfigurationValueType.String,
		Name = "Mapbox Access Token",
		Description = "API Access token for the Mapbox service.",
        SurveyBuilderValueType = QuestionBuilderType.Text)]
		public string AccessToken = "";

		[QuestionConfiguration(QuestionConfigurationValueType.Integer,
		Name = "Mapbox Default Zoom",
		Description = "Initial zoom level.",
        SurveyBuilderValueType = QuestionBuilderType.NumericText)]
		public int Zoom = 8;

		[QuestionConfiguration(QuestionConfigurationValueType.Tuple,
		Name = "Mapbox Default Centre",
		Description = "Initial centre location (lat,lng).",
        SurveyBuilderValueType = QuestionBuilderType.Location)]
		public Tuple<double,double> Centre  = new Tuple<double,double>(-79.40, 43.67);

	}
}

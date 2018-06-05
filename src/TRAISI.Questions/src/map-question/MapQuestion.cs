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
			get => "Map";
		}

		public virtual string Icon
		{
			get => "Map";
		}
		public QuestionIconType IconType { get => QuestionIconType.FONT; }


		[QuestionConfigParameter(QuestionParameterType.String,
		ParameterName = "Mapbox Style",
		ParameterDescription = "Style string to use for map.")]
		public string Style = "mapbox://styles/mapbox/streets-v9?optimize=true";

		[QuestionConfigParameter(QuestionParameterType.String,
		ParameterName = "Mapbox Access Token",
		ParameterDescription = "API Access token for the Mapbox service.")]
		public string AccessToken = "";

		[QuestionConfigParameter(QuestionParameterType.Integer,
		ParameterName = "Mapbox Default Zoom",
		ParameterDescription = "Initial zoom level.")]
		public int Zoom = 8;

		[QuestionConfigParameter(QuestionParameterType.Tuple,
		ParameterName = "Mapbox Default Centre",
		ParameterDescription = "Initial centre location (lat,lng).")]
		public Tuple<double,double> Centre  = new Tuple<double,double>(-79.40, 43.67);

	}
}

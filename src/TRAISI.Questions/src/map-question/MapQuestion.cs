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
		public string Style = "mapbox://styles/mapbox/streets-v9";

		[QuestionConfigParameter(QuestionParameterType.String,
		ParameterName = "Mapbox Access Token",
		ParameterDescription = "API Access token for the Mapbox service.")]
		public string AccessToken = "";

	}
}

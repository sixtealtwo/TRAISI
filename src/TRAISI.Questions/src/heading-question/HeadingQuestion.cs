using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{

	[SurveyQuestion(QuestionResponseType.String)]
	public class HeadingQuestion : ISurveyQuestion
	{
		public string TypeName
		{
			get => "Heading";
		}
		public string Icon
		{
			get => "fa-header";
		}
		public QuestionIconType IconType { get => QuestionIconType.FONT; }

	}

}

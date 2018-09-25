using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{

	[SurveyQuestion(QuestionResponseType.String, CodeBundleName = "traisi-questions-general.module.js")]
	public class HeadingQuestion : ISurveyQuestion
	{
		public string TypeName
		{
			get => "heading";
		}
		public string Icon
		{
			get => "fas fa-heading";
		}
		public QuestionIconType IconType { get => QuestionIconType.FONT; }

	}

}

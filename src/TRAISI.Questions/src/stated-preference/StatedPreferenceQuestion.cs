using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;
using TRAISI.SDK.Library.ResponseTypes;

namespace TRAISI.SDK.Questions
{

	[SurveyQuestion(QuestionResponseType.OptionSelect,
	CodeBundleName = "traisi-questions-sp.module.js",
	CustomBuilderView = "stated_preference_custom_builder",
	 ResponseValidator = typeof(TextQuestionValidator)),
   ]
	public class StatedPreferenceQuestion : ISurveyQuestion
	{
		public string TypeName
		{
			get => "stated_preference";
		}
		public string Icon
		{
			get => "fas fa-table";
		}
		public QuestionIconType IconType { get => QuestionIconType.FONT; }



	}

}

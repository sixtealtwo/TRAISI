using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions
{

	[SurveyQuestion(QuestionResponseType.String)]
	public class TextQuestion : ISurveyQuestion
	{
		public string TypeName
		{
			get => "Text";
		}
		public string Icon
		{
			get => "fa-text-width";
		}
		public QuestionIconType IconType { get => QuestionIconType.FONT; }

		[QuestionConfiguration(QuestionConfigurationValueType.Integer,
			Name = "Max Length",
			Description = "Max number of characters",
			SurveyBuilderValueType = QuestionBuilderType.NumericText,
            DefaultValue = "255")]
		public int MaxLength = 255;

		[QuestionConfiguration(QuestionConfigurationValueType.Boolean,
			Name = "Multiline",
			SurveyBuilderValueType = QuestionBuilderType.Switch,
			Description = "Specifies whether to render a text field or text area.",
            DefaultValue = "false")]
		public bool IsMultiLine = false;

	}

}

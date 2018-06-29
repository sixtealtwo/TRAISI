using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions {

	[SurveyQuestion(QuestionResponseType.String)]
	public class TextQuestion : ISurveyQuestion {
		public string TypeName {
			get => "Text";
		}
		public string Icon {
			get => "Text";
		}
		public QuestionIconType IconType { get => QuestionIconType.FONT; }

		[QuestionConfigurationOption (QuestionParameterType.Integer,
			ParameterName = "Max Length",
			ParameterDescription = "Max number of characters")]
		public int MaxLength = 255;

		[QuestionConfigurationOption (QuestionParameterType.Boolean,
			ParameterName = "Multiline",
			ParameterDescription = "Specifies whether to render a text field or text area.")]
		public bool IsMultiLine = false;

	}

}

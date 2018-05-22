using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions {

	[SurveyQuestion]
	public class TextQuestion : ISurveyQuestion {
		public string TypeName {
			get => "Text";
		}
		public string Icon {
			get => "Text";
		}
		public QuestionIconType IconType { get => QuestionIconType.FONT; }

		[QuestionConfigParameter (QuestionParameterType.Number,
			ParameterName = "Max Length",
			ParameterDescription = "Max number of characters")]
		public int MaxLength = 255;

		[QuestionConfigParameter (QuestionParameterType.Boolean,
			ParameterName = "Multiline",
			ParameterDescription = "Specifies whether to render a text field or text area.")]
		public bool IsMultiLine = false;

	}

}

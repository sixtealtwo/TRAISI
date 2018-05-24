using System.Collections;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK.Questions {
	[SurveyQuestion(QuestionResponseType.Integer)]
	public class RadioQuestion : ISurveyQuestion {
		public string TypeName => "Radio Select";

		public string Icon {
			get => "Radio";
		}
		public QuestionIconType IconType { get => QuestionIconType.FONT; }

		[QuestionParameter (QuestionParameterType.OptionList,
			ParameterName = "Response Options",
			ParameterDescription = "The list of available radio responses presented to the user.")]
		public ICollection ResponseOptions;
	}

}

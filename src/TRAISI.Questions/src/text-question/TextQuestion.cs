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
			SurveyBuilderValueType=QuestionConfigurationValueType.Integer)]
        public int MaxLength = 255;

        [QuestionOption(QuestionOptionValueType.Boolean,
            Name = "Multiline",
			SurveyBuilderValueType=QuestionOptionValueType.Boolean,
            Description = "Specifies whether to render a text field or text area.")]
        public bool IsMultiLine = false;

    }

}

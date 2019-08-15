using System.Collections;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;


namespace TRAISI.SDK.Questions
{
    [SurveyQuestion(QuestionResponseType.Decimal, CodeBundleName = "traisi-questions-general.module.js",
    ResponseValidator = typeof(NumberQuestionValidator))]
    public class SliderQuestion : ISurveyQuestion
    {
        public string TypeName => "slider";

        public string Icon
        {
            get => "fas fa-sliders-h";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }


        public string Format = "Decimal";

        [QuestionConfiguration(QuestionConfigurationValueType.Integer,
        Name = "Min",
        Description = "Minimum Number.",
        SurveyBuilderValueType = QuestionBuilderType.NumericText,
        DefaultValue = "0")]
        public int Min = 0;

        [QuestionConfiguration(QuestionConfigurationValueType.Integer,
        Name = "Max",
        Description = "Maximum Number.",
        SurveyBuilderValueType = QuestionBuilderType.NumericText,
        DefaultValue = "100")]
        public int Max = 100;

        [QuestionConfiguration(QuestionConfigurationValueType.Integer,
        Name = "Step",
        Description = "Slider Step.",
        SurveyBuilderValueType = QuestionBuilderType.NumericText,
        DefaultValue = "5")]
        public int Step = 5;
    }

}

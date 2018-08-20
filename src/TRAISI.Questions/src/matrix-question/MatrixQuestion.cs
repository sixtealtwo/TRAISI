using System.Collections;
using System.Collections.Generic;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Interfaces;


namespace TRAISI.SDK.Questions
{
    [SurveyQuestion(QuestionResponseType.OptionList)]
    public class MatrixQuestion : ISurveyQuestion
    {
        public string TypeName => "Matrix";

        public string Icon
        {
            get => "fa-th";
        }
        public QuestionIconType IconType { get => QuestionIconType.FONT; }

        [QuestionOption(QuestionOptionValueType.KeyValuePair,
        IsMultipleAllowed = true,
            Name = "Row Options",
            Description = "The rows of the matrix presented to the user.",
            SurveyBuilderValueType = QuestionOptionValueType.KeyValuePair)]
        public ICollection RowOptions;

        [QuestionOption(QuestionOptionValueType.KeyValuePair,
        IsMultipleAllowed = true,
            Name = "Column Options",
            Description = "The columns of the matrix presented to the user.",
            SurveyBuilderValueType = QuestionOptionValueType.KeyValuePair)]
        public ICollection ColumnOptions;
    }

}

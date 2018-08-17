using System;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Field)]
    public class QuestionConfigurationAttribute : Attribute
    {
        public string Name { get; set; }

        public string Description { get; set; }

        private QuestionConfigurationValueType _valueType;

        private QuestionBuilderType _surveyBuilderValueType;

        public QuestionConfigurationValueType ValueType { get => this._valueType; }

        public QuestionBuilderType SurveyBuilderValueType {get => _surveyBuilderValueType; set => _surveyBuilderValueType = value; }


        public QuestionConfigurationAttribute(QuestionConfigurationValueType valueType)
        {
            this._valueType = valueType;
        }

    }
}
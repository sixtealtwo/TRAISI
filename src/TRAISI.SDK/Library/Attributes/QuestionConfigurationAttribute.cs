using System;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Field)]
    public class QuestionConfigurationAttribute : Attribute
    {
        public string Name{get;set;}

        public string Description{get;set;}
        private QuestionConfigurationValueType _valueType;
        public QuestionConfigurationAttribute(QuestionConfigurationValueType valueType)
        {
                this._valueType = valueType;
        }

    }
}
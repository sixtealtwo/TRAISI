using System;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Field)]
    public class QuestionSettingsOptionAttribute : Attribute
    {
        public string ParameterName{get;set;}

        public string ParameterDescription{get;set;}
        private QuestionParameterType _parameterType;
        public QuestionSettingsOptionAttribute(QuestionParameterType parameterType)
        {
                this._parameterType = parameterType;
        }

    }
}
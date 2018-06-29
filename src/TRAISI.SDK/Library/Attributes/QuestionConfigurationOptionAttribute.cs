using System;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Field)]
    public class QuestionConfigurationOptionAttribute : Attribute
    {
        public string ParameterName{get;set;}

        public string ParameterDescription{get;set;}
        private QuestionParameterType _parameterType;
        public QuestionConfigurationOptionAttribute(QuestionParameterType parameterType)
        {
                this._parameterType = parameterType;
        }

    }
}
using System;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Field)]
    public class QuestionParameterAttribute : Attribute
    {
        public string ParameterName{get;set;}

        public string ParameterDescription{get;set;}
        private QuestionParameterType _parameterType;
        public QuestionParameterAttribute(QuestionParameterType parameterType)
        {
                this._parameterType = parameterType;
        }

    }
}
using System;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Field)]
    public class QuestionParameterAttribute : Attribute
    {
        public string ParameterName{get;set;}

        public string ParameterDescription{get;set;}
        private Type _parameterType;
        public QuestionParameterAttribute(Type parameterType)
        {
                this._parameterType = parameterType;
        }

    }
}
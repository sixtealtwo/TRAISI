using System;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK.Attributes
{
    /// <summary>
    /// Question Options represent front-end parameters on the builder, that are translatable
    /// </summary>
    [AttributeUsage(AttributeTargets.Field)]
    public class QuestionOptionAttribute : Attribute
    {
        public string Name{get;set;}

        public string Description{get;set;}
        private QuestionOptionValueType _valueType;

        public QuestionOptionValueType ValueType {get => this._valueType; }
        public QuestionOptionAttribute(QuestionOptionValueType valueType)
        {
                this._valueType = valueType;
        }

    }
}
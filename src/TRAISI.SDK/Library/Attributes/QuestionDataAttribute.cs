using System;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Field)]
    public class QuestionDataAttribute : Attribute
    { 
        public string Name {get; set;}

        public string DataPath {get;set;}

        public QuestionDataAttribute()
        {
            
        }


    }
}
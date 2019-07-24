using System;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class SurveyAuthorizationHandlerAttribute : Attribute
    {
        public string Name { get; set; }
    }
}
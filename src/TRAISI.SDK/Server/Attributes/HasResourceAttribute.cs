using System;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Field)]
    public class HasResourceAttribute : Attribute
    {

        public string ResourceName{get;set;}

        public HasResourceAttribute(string resourceName)
        {
            ResourceName = resourceName;
        }

    }
}
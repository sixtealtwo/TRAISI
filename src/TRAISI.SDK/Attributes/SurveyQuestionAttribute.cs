using System;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class SurveyQuestionAttribute : Attribute
    {
        /// <summary>
        /// Specifies whether ot not this SurveyQuestion has a custom builder view.
        /// </summary>
        /// <returns></returns>
       public bool CustomBuilderView{get;set;} = false;

    }
}
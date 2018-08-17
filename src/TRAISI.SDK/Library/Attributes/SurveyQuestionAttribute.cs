using System;
using System.Collections.Generic;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class SurveyQuestionAttribute : Attribute
    {
        /// <summary>
        /// Specifies whether ot not this SurveyQuestion has a custom builder view.
        /// </summary>
        /// <returns></returns>
        public bool CustomBuilderView { get; set; } = false;

        /// <summary>
        /// Gets the ResponseType format of this the attached question definition
        /// </summary>
        /// <returns></returns>
        public QuestionResponseType QuestionResponseType { get; }

        public string[] UseResources { get; set; }

        public SurveyQuestionAttribute(QuestionResponseType responseType)
        {
            this.QuestionResponseType = responseType;

        }

    }
}
using System;
using System.IO;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK
{
    /// <summary>
    /// Contains the definition for a specific question type - path location and other meta info.
    /// </summary>
    public class QuestionTypeDefinition
    {
        public string TypeName { get; set; }

        public DirectoryInfo Location { get; set; }

        public Type Type { get; }

        public QuestionTypeDefinition(Type type, SurveyQuestionAttribute attribute)
        {
            var question = Activator.CreateInstance(type) as ISurveyQuestion;
            this.Type = type;
            TypeName = question.TypeName;
            Icon = question.Icon;

        }

        public string Icon { get; set; }


    }
}
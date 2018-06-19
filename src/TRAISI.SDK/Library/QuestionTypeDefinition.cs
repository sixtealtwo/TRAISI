using System;
using System.IO;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;
using System.Collections.Generic;

namespace TRAISI.SDK
{
    /// <summary>
    /// Contains the definition for a specific question type - path location and other meta info.
    /// </summary>
    public class QuestionTypeDefinition
    {
        public string TypeName { get; set; }

        public DirectoryInfo Location { get; set; }

        public Dictionary<string, object> QuestionConfiguration;

        public Type Type { get; }

        /// <summary>
        /// A list of in memory byte [] data of client code and modules
        /// that is to be served to the front end.
        /// </summary>
        /// <returns></returns>
        public List<byte []> ClientModules {get;set;} 

        /// <summary>
        /// 
        /// </summary>
        /// <param name="type"></param>
        /// <param name="attribute"></param>
        public QuestionTypeDefinition(Type type, SurveyQuestionAttribute attribute)
        {
            var question = Activator.CreateInstance(type) as ISurveyQuestion;
            this.Type = type;
            TypeName = question.TypeName;
            Icon = question.Icon;

            ClientModules = new List<byte[]>();

        }

        public string Icon { get; set; }


    }
}
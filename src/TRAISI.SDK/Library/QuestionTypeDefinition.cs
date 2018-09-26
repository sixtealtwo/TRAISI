using System;
using System.IO;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;
using System.Collections.Generic;
using TRAISI.SDK.Enums;

namespace TRAISI.SDK
{
    /// <summary>
    /// Contains the definition for a specific question type - path location and other meta info.
    /// </summary>
    public class QuestionTypeDefinition
    {
        public string TypeName { get; set; }

        public DirectoryInfo Location { get; set; }

        public Dictionary<string, QuestionOptionDefinition> QuestionOptions { get; set; }

        public Dictionary<string, QuestionConfigurationDefinition> QuestionConfigurations { get; set; }

        private Dictionary<string, byte[]> _resourceData = new Dictionary<string, byte[]>();
        public Dictionary<string, byte[]> ResourceData
        {
            get
            {
                return this._resourceData;
            }
        }

        public QuestionResponseType ResponseType { get; set; }

        public string CodeBundleName { get; set; }

        public Dictionary<string, string> TypeNameLocales { get; } = new Dictionary<string, string>();

        /// <summary>
        /// Set of Question Part Slots
        /// </summary>
        /// <value></value>
        public List<QuestionPartSlotDefinition> QuestionPartSlots { get; set; }


        public ISurveyQuestion Type { get; }

        /// <summary>
        /// A list of in memory byte [] data of client code and modules
        /// that is to be served to the front end.
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, byte[]> ClientModules { get; set; } = new Dictionary<string, byte[]>();

        public Dictionary<string, QuestionResource> QuestionResources { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="type"></param>
        /// <param name="attribute"></param>
        public QuestionTypeDefinition(ISurveyQuestion type, SurveyQuestionAttribute attribute)
        {
            //var question = Activator.CreateInstance(type) as ISurveyQuestion;
            this.Type = type;
            TypeName = type.TypeName;
            Icon = type.Icon;

            QuestionResources = new Dictionary<string, QuestionResource>();

            CodeBundleName = attribute.CodeBundleName;

        }

        public string Icon { get; set; }


    }
}
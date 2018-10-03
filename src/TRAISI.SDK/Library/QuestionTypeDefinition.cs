using System;
using System.IO;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;
using System.Collections.Generic;
using TRAISI.SDK.Enums;
using TRAISI.SDK.Library.ResponseTypes;
using System.Reflection;

namespace TRAISI.SDK
{
    /// <summary>
    /// Contains the definition for a specific question type - path location and other meta info.
    /// </summary>
    public class QuestionTypeDefinition
    {

        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public string TypeName { get; set; }


        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public DirectoryInfo Location { get; set; }


        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public Dictionary<string, QuestionOptionDefinition> QuestionOptions { get; set; }


        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public Dictionary<string, QuestionConfigurationDefinition> QuestionConfigurations { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="string"></typeparam>
        /// <typeparam name="byte[]"></typeparam>
        /// <returns></returns>
        private Dictionary<string, byte[]> _resourceData = new Dictionary<string, byte[]>();

        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public Dictionary<string, byte[]> ResourceData
        {
            get
            {
                return this._resourceData;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public QuestionResponseType ResponseType { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public string CodeBundleName { get; set; }

        public Dictionary<string, string> TypeNameLocales { get; } = new Dictionary<string, string>();

        /// <summary>
        /// Set of Question Part Slots
        /// </summary>
        /// <value></value>
        public List<QuestionPartSlotDefinition> QuestionPartSlots { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public ISurveyQuestion Type { get; }

        /// <summary>
        /// How many "internal" views are available for this question - each view requires its own title text
        /// </summary>
        /// <value></value>
        public int InternalNavigationViewCount { get; set; } = 1;

        /// <summary>
        /// A list of in memory byte [] data of client code and modules
        /// that is to be served to the front end.
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, byte[]> ClientModules { get; set; } = new Dictionary<string, byte[]>();

        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public Dictionary<string, QuestionResource> QuestionResources { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public string Icon { get; set; }


        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public ResponseValidator ResponseValidator { get; private set; }

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

            if (attribute.ResponseValidator != null) {

                var instance = (ResponseValidator)Activator.CreateInstance(attribute.ResponseValidator);
                this.ResponseValidator = instance;
            }

        }






    }
}
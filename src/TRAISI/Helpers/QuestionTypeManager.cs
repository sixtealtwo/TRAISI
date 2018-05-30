using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using TRAISI.Helpers;
using TRAISI.SDK.Attributes;
using TRAISI.SDK.Interfaces;

namespace TRAISI.SDK
{

    public class QuestionTypeManager : IQuestionTypeManager
    {
        private ICollection<QuestionTypeDefinition> _questionTypeDefinitions;

        private IConfiguration _configuration;

        private ILoggerFactory _loggerFactory;

        private ILogger<QuestionTypeManager> _logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="configuration"></param>
        public QuestionTypeManager(IConfiguration configuration,
        ILoggerFactory loggerFactory)
        {
            this._configuration = configuration;
            this._loggerFactory = loggerFactory;

            this._logger = loggerFactory.CreateLogger<QuestionTypeManager>();
            _questionTypeDefinitions = new LinkedList<QuestionTypeDefinition>();


        }

        /// <summary>
        /// 
        /// </summary>
        public void LoadQuestionExtensions()
        {
            LoadExtensionAssemblies();
            LoadQuestionTypeDefinitions();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="type"></param>
        /// <param name="attribute"></param>
        private void CreateQuestionTypeDefinition(Type questionType, SurveyQuestionAttribute attribute, Assembly sourceAssembly)
        {
            var typeDefinition = new QuestionTypeDefinition(questionType, attribute);
            _questionTypeDefinitions.Add(typeDefinition);

            typeDefinition.ClientModules.Add(GetTypeClientData(typeDefinition, sourceAssembly));

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="typeDefinition"></param>
        /// <param name="sourceAssembly"></param>
        /// <returns></returns>
        private byte[] GetTypeClientData(QuestionTypeDefinition typeDefinition, Assembly sourceAssembly)
        {
            string resourceName = sourceAssembly.GetManifestResourceNames().Single(r => r.Contains(typeDefinition.TypeName));


            using (MemoryStream ms = new MemoryStream())
            {
                sourceAssembly.GetManifestResourceStream(resourceName).CopyTo(ms);
                return ms.ToArray();
            }
        }

        /// <summary>
        /// Load all extension (dll) included in the configured extensions directory.
        /// </summary>
        public void LoadExtensionAssemblies()
        {
            this._logger.LogInformation("Loading TRAISI extensions");
            if (!Directory.Exists("extensions"))
            {
                this._logger.LogWarning("Extensions folder does not exist.");
                return;
            }
            //assume from configuration at the moment
            var s = from d in Directory.EnumerateFiles("extensions")
                    where d.EndsWith(".dll")
                    select d;

            Directory.EnumerateFiles("extensions").Where(file => file.EndsWith("dll")).ToList<string>().ForEach((file) =>
            {
                try
                {
                    string loadFrom = Path.Combine(Directory.GetCurrentDirectory(), file);
                    Assembly.LoadFile(loadFrom);
                    this._logger.LogInformation($"Loading extension {Path.GetFileName(file)}");
                }
                catch (Exception e)
                {
                    this._logger.LogWarning(e, "Error loading extension assembly.");
                }
            });

            return;
        }

        public ICollection<QuestionTypeDefinition> QuestionTypeDefinitions { get { return this._questionTypeDefinitions; } }

        /// <summary>
        /// 
        /// </summary>
        public void LoadQuestionTypeDefinitions(string loadFrom = ".")
        {
            Assembly[] assemblies = AppDomain.CurrentDomain.GetAssemblies();

            foreach (var assembly in assemblies)
            {
                Type[] types = assembly.GetTypes();
                foreach (var type in types)
                {

                    var e = type.GetCustomAttributes(typeof(SurveyQuestionAttribute));

                    foreach (var attribute in e)
                    {
                        if (attribute.GetType() == typeof(SurveyQuestionAttribute))
                        {
                            CreateQuestionTypeDefinition(type, (SurveyQuestionAttribute)attribute, assembly);
                        }
                    }

                }
            }

        }

    }
}